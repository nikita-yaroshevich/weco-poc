import { TransformableInterface, TransformerOptions } from './common';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/ClassTransformOptions';
import { excludePropsHelper } from './helpers';

/**
 * @class
 * @description Create new Object with target type and copy props from data to it using class-transformer lib
 */
export class ToTypeTransformer<T = any> implements TransformableInterface {
    // private Type: T;
    constructor(protected TCreator: (new () => T) | T) {}

    transform(data: any, options: ClassTransformOptions & TransformerOptions = {}): T {
        if (Boolean((this.TCreator as new () => T).prototype) && Boolean((this.TCreator as new () => T).prototype.constructor)) {
            return excludePropsHelper(plainToClass(this.TCreator as new () => T, data as object, options), options.exclude);
        } else {
            return excludePropsHelper(plainToClassFromExist(this.TCreator as T, data as object, options), options.exclude);
        }
    }
}
