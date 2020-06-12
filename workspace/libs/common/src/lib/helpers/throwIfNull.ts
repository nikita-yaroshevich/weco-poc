import { tap } from 'rxjs/internal/operators';
import { NotFoundException } from '../exceptions';

function defaultErrorFactory() {
    return new NotFoundException(`Empty result set`);
}

export const throwIfNull = <T>(errorFactory: () => any = defaultErrorFactory) =>
    tap<T>({
        value: [],
        next(v: any) {
            this.value.push(v);
        },
        complete() {
            if (this.value.filter(v => !!v).length === 0) {
                throw errorFactory();
            }
        }
    } as any);
