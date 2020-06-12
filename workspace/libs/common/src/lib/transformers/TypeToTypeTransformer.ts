import { TransformableInterface, TransformerOptions } from './common';
import { classToPlain } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/ClassTransformOptions';
import { ToTypeTransformer } from './ToTypeTransformer';

/**
 * @class
 * @description Create new Object with target type and copy props from data to it using class-transformer lib
 */
export class TypeToTypeTransformer<T = any> implements TransformableInterface {
    constructor(protected TCreator: (new () => T) | any) {}

    transform(data: any, options: ClassTransformOptions & TransformerOptions = {}): T {
        // const entity: any = new this.TCreator();
        // Object.keys(data).forEach((key: string) => {
        //     entity[key] = data[key];
        // });
        // return entity;
        // const opts = {...(options), ...{groups:['t2t']}};
        const tmpData: any = classToPlain(data, options);
        return new ToTypeTransformer(this.TCreator).transform(tmpData, options);
    }
}
