import { FunctionTransformer } from './FunctionTransformer';
import { TransformableInterface, TransformerOptions } from './common';

/**
 * @class
 * Apply target to TransformableInterface to every element in data array
 */
export class CollectionTransformer implements TransformableInterface {
    private transformer: TransformableInterface;

    constructor(t: TransformableInterface | ((data, options?) => any)) {
        if (t instanceof Function) {
            this.transformer = new FunctionTransformer(t);
        } else {
            this.transformer = t;
        }
    }

    /**
     * Transform any default or include data into a basic array.
     * @param data
     * @param options
     */
    transform(data: any[] = [], options?: TransformerOptions | any): any {
        return [].concat(data).map(item => this.transformer.transform(item, options));
    }
}
