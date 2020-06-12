import { AuthProviderInterface, UserTokenInterface } from '../../common';
import { DummyUserToken } from './DummyUserToken';
import { AnonymousUserToken } from '../../AnonymousUserToken';
import { DummyUsernamePasswordToken } from './DummyUsernamePasswordToken';
import { InvalidCredentialsException } from '../../../../exceptions';
import { CacheProviderInterface, CacheService } from '../../../cache';

export class DummyAuthProvider implements AuthProviderInterface {
    static STORAGE_KEY = 'DUMMY_AUTH_PROVIDER';
    constructor(public usersList: { username: string; password: string; roles: string[] }[], private cache: CacheService) {}

    get storage(): CacheProviderInterface {
        return this.cache.getBucket(DummyAuthProvider.STORAGE_KEY);
    }

    async validate(token): Promise<UserTokenInterface | Error> {
        if (token instanceof DummyUserToken) {
            if (await this.storage.has(token.getUsername()).toPromise()) {
                const data = await this.storage.get(token.getUsername()).toPromise();
                return new DummyUserToken(data);
            }
        }
        if (token instanceof DummyUsernamePasswordToken) {
            const creds = this.usersList.find(creds => creds.username === token.username && creds.password === token.password);
            if (creds) {
                const userData = {
                    username: token.username,
                    roles: [...creds.roles],
                    payload: {
                        signedId: new Date().toLocaleDateString()
                    }
                };
                await this.storage.set(userData.username, userData).toPromise();
                return new DummyUserToken(userData);
            } else {
                return new InvalidCredentialsException(`Invalid username or password`);
            }
        }
    }

    logout(token: DummyUserToken): Promise<AnonymousUserToken> {
        if (this.storage.has(token.getUsername())) {
            this.storage.remove(token.getUsername());
        }
        return Promise.resolve(new AnonymousUserToken());
    }

    support(token) {
        return token instanceof DummyUsernamePasswordToken || token instanceof DummyUserToken;
    }
}
