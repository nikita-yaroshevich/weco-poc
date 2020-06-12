import { TransformableInterface, TransformerOptions } from './common';
import { classToPlain } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/ClassTransformOptions';
import { excludePropsHelper } from './helpers';

/**
 * @class
 * @description Create new plain Object copy props from data to it using class-transformer lib
 */
export class ToPlainTransformer implements TransformableInterface {
    transform(data: any, options: ClassTransformOptions & TransformerOptions = {}): any {
        return excludePropsHelper(classToPlain(data, options), options.exclude);
    }
}
