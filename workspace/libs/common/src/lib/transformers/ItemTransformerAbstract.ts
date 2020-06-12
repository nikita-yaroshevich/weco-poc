import * as _ from 'lodash';
import * as Inflector from 'inflected';
import { TransformableInterface, TransformerOptions } from './common';

/**
 * @class
 * All Transformer classes should extend this to utilize the convenience methods.
 * You can add includePropertyName to extended class, and pass TransformerOptions.include param with name
 * propertyName to add optional includes.
 *
 * Extend it and add a `transform()` method to transform any default or included data
 * into a basic array.
 */
export abstract class ItemTransformerAbstract implements TransformableInterface {
    /**
     * List of by default included dynamic properties
     * @type {string[]}
     */
    protected defaultIncludes: string[] = [];

    /**
     * Transform any default or\and include\exclude data into a basic array.
     * To apply includes you can follow the example
     * @example
     * let transformedData = {id: data.id, ...};
     * return _.assign(transformedData, this.getIncludeData(data, options?));
     *
     * @param data
     * @param {TransformerOptions|any} options
     */
    abstract transform(data: any, options?: TransformerOptions | any): any;

    /**
     * return included data
     * @param data
     * @param options
     * @return {any}
     */
    protected getIncludeData(data: any, options?: TransformerOptions | any) {
        const includes = this.getIncludes(options);
        const result: any = {};
        for (const incName of includes) {
            try {
                result[incName] = this[this.getIncludeMethodName(incName)](data, options);
            } catch (e) {
                throw new Error('Unable to transform with error ' + e.toString());
            }
        }
        return result;
    }

    protected getIncludes(options: TransformerOptions): string[] {
        options = options || {};
        let incs: any = _.without(_.uniq(this.defaultIncludes.concat(options.include || [])) as any, options.exclude);
        incs = incs.filter((name: string) => this[this.getIncludeMethodName(name)] as any);
        return incs;
    }

    protected getIncludeMethodName(name: string): string {
        return 'include' + Inflector.classify(name);
    }
}
