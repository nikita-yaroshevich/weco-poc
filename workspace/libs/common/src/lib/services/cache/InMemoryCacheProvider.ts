import { CacheProviderInterface } from './CacheProviderInterface';
import { from, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/internal/operators';

interface CacheContent {
    expiry: number;
    value: any;
}

/**
 * Cache Provider is an observables based in-memory cache implementation
 * Keeps track of in-flight observables and sets a default expiry for cached values
 */
export class InMemoryCacheProvider implements CacheProviderInterface {
    private cache: Map<string, CacheContent> = new Map<string, CacheContent>();
    readonly DEFAULT_MAX_AGE: number = 300000;

    /**
     * Gets the value from cache if the key is provided.
     * If no value exists in cache, then check if the same call exists
     * in flight, if so return the subject. If not create a new
     * Subject inFlightObservable and return the source observable.
     */
    get(key: string, fallback?: Observable<any>, maxAge?: number | ((data) => number)): Observable<any> | Subject<any> {
        if (this.hasValidCachedValue(key)) {
            return of(this.cache.get(key).value);
        }

        if (fallback && fallback instanceof Observable) {
            return fallback.pipe(map(value => this.set(key, value, maxAge)));
        } else {
            throw new Error('Requested key is not available in Cache');
        }
    }

    /**
     * Sets the value with key in the cache
     * Notifies all observers of the new value
     */
    set(key: string, value: any, maxAge: number | ((data) => number) = this.DEFAULT_MAX_AGE): Observable<any> {
        const expires_in = maxAge instanceof Function ? maxAge(value) : maxAge;
        this.cache.set(key, { value, expiry: Date.now() + expires_in });
        return of(value);
    }

    /**
     * Checks if the a key exists in cache
     */
    has(key: string): Observable<boolean> {
        return of(this.cache.has(key));
    }

    remove(key: string): Observable<boolean> {
        return of(this.cache.delete(key));
    }

    /**
     * Checks if the key exists and   has not expired.
     */
    private hasValidCachedValue(key: string): boolean {
        if (this.cache.has(key)) {
            if (this.cache.get(key).expiry < Date.now()) {
                this.cache.delete(key);
                return false;
            }
            return true;
        } else {
            return false;
        }
    }

    finalize(): void {
        this.cache.clear();
    }
}
