import { RedisOptions } from 'ioredis';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { RedisPathClient } from './RedisPathClient';
import * as IORedis from 'ioredis';

export class RedisClientService {
    private _client: IORedis.Redis;

    get client(): IORedis.Redis {
        return this._client;
    }

    /**
     *
     * @param {IORedis.RedisOptions} options
     * @return {this}
     */
    connect(options: RedisOptions = {}) {
        this._client = new IORedis(options);
        return this;
    }

    /**
     *
     * @return {boolean}
     */
    get isConnected() {
        return !!this._client;
    }

    /**
     *
     * @param {string} key
     * @param {string} field
     * @return {Promise<any>}
     */
    get(key: string, field: string): Observable<any> {
        return from(
            this.client.hget(key, field).then(response => {
                return JSON.parse(response);
            })
        );
    }

    /**
     *
     * @param {string} key
     * @param {string} field
     * @param value
     * @return {Promise<any>}
     */
    set(key: string, field: string, value: any): Observable<any> {
        return from(this.client.hset(key, field, JSON.stringify(value)).then(() => value));
    }

    has(key: string, field: string): Observable<any> {
        return this.get(key, field).pipe(map(v => !!v));
    }

    removeField(key: string, field: string): Observable<any> {
        return from(this.client.hdel(key, field));
    }

    remove(key: string): Observable<any> {
        return from(this.client.hdel(key));
    }

    getRedisPathClient(path: string): RedisPathClient {
        return new RedisPathClient(this, path);
    }
}
