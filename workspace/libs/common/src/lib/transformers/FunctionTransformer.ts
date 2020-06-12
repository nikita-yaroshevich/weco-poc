import { TransformableInterface } from './common';

/**
 * @class
 * Wrap any function to transformer
 */
export class FunctionTransformer implements TransformableInterface {
    constructor(public cb: (data, options?) => any) {}

    transform(data: any, options?: any): any {
        return this.cb(data, options);
    }
}
