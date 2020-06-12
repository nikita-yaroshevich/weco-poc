import { Observable, Subject } from 'rxjs/index';
import { Finalizable } from '../../interfaces';

export interface CacheProviderInterface extends Finalizable {
    /**
     * Gets the value from cache if the key is provided.
     * If no value exists in cache, then check if the same call exists
     * in flight, if so return the subject. If not create a new
     * Subject inFlightObservable and return the source observable.
     */
    get(key: string, fallback?: Observable<any>, maxAge?: number | ((data) => number)): Observable<any> | Subject<any>;
    /**
     * Sets the value with key in the cache
     * Notifies all observers of the new value
     */
    set(key: string, value: any, maxAge?: number | ((data) => number)): Observable<any>;
    /**
     * Checks if the a key exists in cache
     */
    has(key: string): Observable<boolean>;

    remove(key: string): Observable<boolean>;
}
