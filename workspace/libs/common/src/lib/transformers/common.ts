/**
 * Transformer options optional type
 */
export class TransformerOptions {
    /**
     *
     */
    include?: string[];
    exclude?: string[];
}

/**
 * @class
 * All Transformer classes should extend this to utilize the convenience methods
 */
export interface TransformableInterface {
    /**
     * Transform any default or include data into a basic array.
     * @param data
     * @param options
     * @throws Error
     */
    transform(data: any, options?: any): any;
}
