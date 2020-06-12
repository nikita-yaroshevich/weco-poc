import { FunctionTransformer } from './FunctionTransformer';
import { CollectionTransformer } from './CollectionTransformer';
import { ChainTransformer } from './ChainTransformer';
import { ItemTransformerAbstract } from './ItemTransformerAbstract';
import { TransformerOptions } from './common';
import * as _ from 'lodash';

describe('transformers:', () => {
    const data = [
        { username: 'Jane', email: 'jane@doe.com' },
        { username: 'Jhone', email: 'jhon@doe.com' },
        { username: 'zeus', email: 'zeus@doe.com' }
    ];

    function transformFunction(data) {
        return {
            name: data.username
        };
    }

    class SimpleTransformerTest extends ItemTransformerAbstract {
        protected defaultIncludes = ['email'];

        transform(data: any, options?: TransformerOptions | any) {
            return _.assign(transformFunction(data), this.getIncludeData(data, options));
        }

        includeEmail(data) {
            return data.email.toUpperCase();
        }

        includeEmail1stLvlDomain(data) {
            return 'com';
        }
    }

    it('should transform value via FunctionTransformer', () => {
        const result = new FunctionTransformer(transformFunction).transform(data[0]);

        expect(result.name).toEqual(data[0].username);
        expect(result).not.toEqual(data[0]);
    });

    it('should transform several values via FunctionTransformer', () => {
        const result = new CollectionTransformer(new FunctionTransformer(transformFunction)).transform(data);

        expect(result.length).toEqual(data.length);
        expect(result[result.length - 1].name).toEqual(data[data.length - 1].username);
        expect(result[result.length - 1].name).not.toEqual(data[0].username);
        expect(result).not.toEqual(data);
    });

    it('should transform several values in Chain via FunctionTransformer and simple function', () => {
        const transformer = new ChainTransformer(new CollectionTransformer(new FunctionTransformer(transformFunction)));
        const result = transformer
            .addTransformer((data: any[]) => {
                return data.map(d => d.name + '1');
            })
            .transform(data);

        expect(result.length).toEqual(data.length);
        expect(result[result.length - 1]).toEqual(data[data.length - 1].username + '1');
        expect(result).not.toEqual(data);
    });

    it('should transform several values in Chain via FunctionTransformer and simple function', () => {
        const transformer = new ChainTransformer(new CollectionTransformer(new FunctionTransformer(transformFunction)));
        const result = transformer.transform(
            data,
            transformer.addTransformer((data: any[]) => {
                return data.map(d => d.name + '1');
            })
        );

        expect(result.length).toEqual(data.length);
        expect(result[result.length - 1]).toEqual(data[data.length - 1].username + '1');
        expect(result).not.toEqual(data);
    });

    it('should transform several values with ItemTransformerAbstract and include email', () => {
        const result = new CollectionTransformer(new SimpleTransformerTest()).transform(data);

        expect(result.length).toEqual(data.length);
        expect(result[result.length - 1].name).toEqual(data[data.length - 1].username);
        expect(result[result.length - 1].email).toEqual(data[data.length - 1].email.toUpperCase());
        expect(result).not.toEqual(data);
    });

    it('should transform several values with ItemTransformerAbstract and exclude email include email1stLvlDomain', () => {
        const result = new CollectionTransformer(new SimpleTransformerTest()).transform(data, {
            include: 'email1stLvlDomain',
            exclude: 'email'
        });

        expect(result.length).toEqual(data.length);
        expect(result[result.length - 1].email).toBeUndefined();
        expect(result[result.length - 1].email1stLvlDomain).toEqual('com');
    });

    it('ChainTransformer should throw exception when two same transformers added', () => {
        const transformer = new ChainTransformer(transformFunction);

        expect(() => transformer.addTransformer(transformFunction)).toThrow();

        transformer.addTransformer(new FunctionTransformer(transformFunction));

        transformer.addTransformer(() => {});
        expect(transformer.getTransformers().length).toBe(3);
    });

    it('ChainTransformer should remove transformer if it exist', () => {
        const transformer = new ChainTransformer(transformFunction);
        const t2 = new FunctionTransformer(transformFunction);
        transformer.addTransformer(t2);
        transformer.addTransformer(() => {});
        expect(transformer.getTransformers().length).toBe(3);

        const tCount = transformer.getTransformers().length;

        expect(transformer.hasTransformer(transformFunction)).toBeTruthy();
        expect(transformer.hasTransformer(t2)).toBeTruthy();
        expect(transformer.hasTransformer(() => {})).toBeFalsy();
        expect(transformer.removeTransformer(transformFunction)).toBe(transformer);
        expect(transformer.getTransformers().length).toBe(tCount - 1);
    });
});
