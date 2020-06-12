import { AuthProviderInterface, AuthProviderSignupInterface, UserTokenInterface } from './common';
import { AnonymousUserToken } from './AnonymousUserToken';

/**
 * @class Main Service do deal with user roles authentication
 */
export class AuthService {
    /**
     * List of available Auth providers
     */
    constructor(private providers: AuthProviderInterface[]) {}

    /**
     * Goes through all registered providers, finds the first one which supports given token
     * and tries to auth using it to validate
     * @param token
     * @return {Promise<UserTokenInterface|Error>}
     */
    async validate(token): Promise<UserTokenInterface | Error> {
        const provider = this.providers.find(p => p.support && p.support(token));
        if (!provider) {
            throw new Error(`Unable to find Auth Provider`);
        }
        return provider
            .validate(token)
            .then(newToken => {
                return newToken;
            })
            .catch(e => {
                return Promise.reject(e);
            });
    }

    async signup(token): Promise<UserTokenInterface | any> {
        const provider = this.providers.find(p => p.support && p.support(token));
        if (!provider && !(provider as any).signup) {
            throw new Error(`Unable to find Auth Provider or it didn't support signup`);
        }
        return (provider as AuthProviderSignupInterface).signup(token);
    }

    async logout(token?: UserTokenInterface): Promise<UserTokenInterface> {
        if (token) {
            const provider = this.providers.find(p => p.support && p.support(token));
            if (!provider) {
                return Promise.reject(new Error(`Unable to find Auth Provider`));
            }

            return provider.logout(token).then(newToken => {
                return newToken;
            });
        }

        return Promise.all(this.providers.map((p: AuthProviderInterface) => p.logout()))
            .then(() => new AnonymousUserToken())
            .catch(() => new AnonymousUserToken());
    }

    getProviderFor<T = AuthProviderInterface>(token): T {
        const provider = this.providers.find(p => p.support && p.support(token));
        if (!provider) {
            throw new Error(`Unable to find Auth Provider`);
        }
        return (provider as unknown) as T;
    }

    getProvider<T = AuthProviderInterface>(ProviderType): T {
        const provider = this.providers.find(p => p instanceof ProviderType);
        if (!provider) {
            throw new Error(`Unable to find Auth Provider with type ${ProviderType}`);
        }
        return (provider as unknown) as T;
    }
}
