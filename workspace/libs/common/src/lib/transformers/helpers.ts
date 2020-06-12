import { TransformableInterface, TransformerOptions } from './common';
import { ClassTransformOptions } from 'class-transformer';
import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

export function mapTransform<T, R>(
    transformer: TransformableInterface,
    options?: ClassTransformOptions & TransformerOptions | any
): OperatorFunction<T, R> {
    return map<T, R>((value: any) => transformer.transform(value, options));
}

export function promisePipeTransform(transformer: TransformableInterface): (data: any) => Promise<any> {
    return (data: any) => transformer.transform(data);
}

export function excludePropsHelper(data: any, exclude?: string[]) {
    if (Array.isArray(exclude)) {
        exclude.forEach(fieldName => {
            delete data[fieldName];
            // result[fieldName] = undefined;
        });
    }
    return data;
}
