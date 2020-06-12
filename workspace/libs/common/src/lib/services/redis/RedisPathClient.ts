import { RedisClientService } from './redis-client.service';
import { from, Observable } from 'rxjs';

export class RedisPathClient {
    constructor(public readonly client: RedisClientService, public readonly path: string) {}

    get(field: string): Observable<any> {
        return this.client.get(this.path, field);
    }

    set(field: string, value: any): Observable<any> {
        return this.client.set(this.path, field, value);
    }

    has(field: string): Observable<boolean> {
        return this.client.has(this.path, field);
    }

    remove(field: string): Observable<boolean> {
        return this.client.removeField(this.path, field);
    }

    getAll(): Observable<any[]> {
        return from(this.client.client.hgetall(this.path));
    }
}
