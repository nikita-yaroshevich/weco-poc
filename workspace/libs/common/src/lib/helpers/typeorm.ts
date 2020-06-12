import { Observable, throwError } from 'rxjs/index';
import { DatabaseException, DuplicateEntityException } from '../exceptions';

export function wrapExceptions(e: any): Observable<never> {
    switch (e.code) {
        case '23505': {
            return throwError(new DuplicateEntityException(e.detail || e.message || e.toString()));
            break;
        }
        default:
            return throwError(DatabaseException.fromTypeOrmError(e));
    }
}
