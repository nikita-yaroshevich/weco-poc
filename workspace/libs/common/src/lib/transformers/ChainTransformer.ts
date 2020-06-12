import { FunctionTransformer } from './FunctionTransformer';
import { DuplicateEntityException } from '../exceptions/exceptions';
import { TransformableInterface, TransformerOptions } from './common';

/**
 * @class
 * Queue of TransformableInterface instances which should be called one by one to transform the data
 * Result of the first transformer is the source for the second and so on.
 */
export class ChainTransformer implements TransformableInterface {
    protected transformers: { transformer: TransformableInterface; options: any }[] = [];

    constructor(
        transformers?: ((data, options?) => any) | TransformableInterface | (((data, options?) => any) | TransformableInterface | undefined)[]
    ) {
        if (transformers) {
            if (Array.isArray(transformers)) {
                transformers.forEach(t => {
                    this.addTransformer(t);
                });
            } else {
                this.addTransformer(transformers);
            }
        }
    }

    /**
     * Add transformer or function as transformer. Should be uniq.
     * @param t
     * @param opt  options associated with current transformer. will be deeply merged with options passed to transform method
     * @return {ChainTransformer}
     * @throws DuplicateEntityException
     */
    addTransformer(t: ((data, options?) => any) | TransformableInterface, opt?: any): this {
        if (this.hasTransformer(t)) {
            throw new DuplicateEntityException(``);
        }

        if (t instanceof Function) {
            this.transformers.push({
                transformer: new FunctionTransformer(t as (data, options?) => any),
                options: opt
            });
        } else {
            this.transformers.push({ transformer: t, options: opt });
        }
        return this;
    }

    /**
     * Check if transformer already is in the list
     * @param t
     * @return {boolean}
     */
    hasTransformer(t: TransformableInterface | ((data, options?) => any)): boolean {
        return !!this.transformers.find(item => {
            return item.transformer === t || ((item.transformer as FunctionTransformer).cb && (item.transformer as FunctionTransformer).cb === t);
        });
    }

    /**
     * remove transformer from the chain
     * @param {TransformableInterface | Function} t
     * @return {this}
     */
    removeTransformer(t: TransformableInterface | ((data, options?) => any)): this {
        this.transformers = this.transformers.filter(item => {
            return item.transformer === t || ((item.transformer as FunctionTransformer).cb && (item.transformer as FunctionTransformer).cb === t);
        });
        return this;
    }

    /**
     *
     * @return {{transformer: TransformableInterface, options: any}[]}
     */
    getTransformers(): { transformer: TransformableInterface; options: any }[] {
        return this.transformers;
    }

    transform(data: any, options?: TransformerOptions | any): any {
        let result = data;
        this.transformers.forEach(t => {
            result = t.transformer.transform(result, { ...(options || {}), ...(t.options || {}) });
        });
        return result;
    }
}
