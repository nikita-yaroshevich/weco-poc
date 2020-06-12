import { Observable, Subject } from 'rxjs';
import { CacheProviderInterface } from './CacheProviderInterface';
import { InMemoryCacheProvider } from './InMemoryCacheProvider';
import { DuplicateEntityException } from '../../exceptions';

export class CacheService implements CacheProviderInterface {
    private buckets: Map<string, CacheProviderInterface> = new Map<string, CacheProviderInterface>();

    constructor(providers: { [name: string]: CacheProviderInterface } = {}) {
        this.addBucket('memory', new InMemoryCacheProvider());
        this.addBucket('default', this.buckets.get('memory'));
        Object.keys(providers).forEach(name => {
            this.addBucket(name, providers[name]);
        });
    }

    addBucket(name: string, provider: CacheProviderInterface, isDefault = false) {
        if (this.hasBucket(name)) {
            throw new DuplicateEntityException(`Cache bucket with name '${name}' already exist`);
        }
        this.buckets.set(name, provider);
        if (isDefault) {
            this.buckets.set('default', provider);
        }
        return this;
    }

    removeBucket(name) {
        this.getBucket(name).finalize();
        this.buckets.delete(name);
        return this;
    }

    hasBucket(name: string): boolean {
        return this.buckets.has(name);
    }

    getBucket(name = 'default'): CacheProviderInterface {
        return this.buckets.has(name) ? this.buckets.get(name) : this.buckets.get('default');
    }

    get bucket(): CacheProviderInterface {
        return this.getBucket();
    }

    get(key: string, fallback?: Observable<any>, maxAge?: number | ((data) => any)): Observable<any> | Subject<any> {
        return this.bucket.get(key, fallback, maxAge);
    }

    set(key: string, value: any, maxAge: number | ((data) => any)): Observable<any> {
        return this.bucket.set(key, value, maxAge);
    }

    has(key: string): Observable<boolean> {
        return this.bucket.has(key);
    }

    remove(key: string): Observable<boolean> {
        return this.bucket.remove(key);
    }

    finalize(): void {
        try {
            this.buckets.forEach((p: CacheProviderInterface) => p.finalize());
        } catch (e) {}
    }
}
