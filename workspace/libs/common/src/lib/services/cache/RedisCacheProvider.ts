import { CacheProviderInterface } from './CacheProviderInterface';
import { Observable, of, Subject } from 'rxjs/index';
import { map, switchMap, tap } from 'rxjs/internal/operators';
import { RedisPathClient } from '../redis';

export class RedisCacheProvider implements CacheProviderInterface {
    readonly DEFAULT_MAX_AGE: number = 300000;

    // private redis: RedisPathClient;

    constructor(private readonly redis: RedisPathClient) {
        // this.redis = redis.getRedisPathClient('CACHE/APP');
    }

    get(key: string, fallback?: Observable<any>, maxAge?: number | ((data) => number)): Observable<any> | Subject<any> {
        return this.hasValidCachedValue(key).pipe(
            switchMap(isExist => {
                if (isExist) {
                    return this.redis.get(key).pipe(map(content => content.value));
                } else {
                    if (fallback && fallback instanceof Observable) {
                        return fallback.pipe(tap()).pipe(switchMap(value => this.set(key, value, maxAge as any)));
                    } else {
                        throw new Error(`Unable to process requested cache value with key ${key}`);
                    }
                }
            })
        );
    }

    set(key: string, value: any, maxAge: number | ((data) => number) = this.DEFAULT_MAX_AGE): Observable<any> {
        const expires_in = maxAge instanceof Function ? maxAge(value) : maxAge;
        this.invalidateExpired();
        return this.redis.set(key, { value, expiry: Date.now() + expires_in }).pipe(map(content => content.value));
    }

    has(key: string): Observable<boolean> {
        return this.redis.has(key);
    }

    remove(key: string): Observable<boolean> {
        return this.redis.remove(key);
    }

    /**
     * Checks if the key exists and   has not expired.
     */
    private hasValidCachedValue(key: string): Observable<boolean> {
        return this.redis
            .has(key)
            .pipe(
                switchMap(isExist =>
                    isExist
                        ? this.redis
                              .get(key)
                              .pipe(switchMap(cached => (cached.expiry < Date.now() ? this.redis.remove(key).pipe(map(v => false)) : of(true))))
                        : of(false)
                )
            );
    }

    public invalidateExpired() {
        this.redis.getAll().subscribe(resultset => {
            Object.keys(resultset).map(key => {
                let data;
                try {
                    data = JSON.parse(resultset[key]);
                } catch (e) {
                    this.redis.remove(key);
                }
                try {
                    if (data.expiry < Date.now()) {
                        this.redis.remove(key);
                    }
                } catch (e) {}
            });
        });
    }

    finalize(): void {
        this.redis.client.remove(this.redis.path);
    }
}
