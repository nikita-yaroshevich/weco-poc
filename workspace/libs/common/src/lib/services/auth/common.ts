/**
 * @class Base interface which every provider should extend to follow contract
 * requires an validate() method on the user token, and a supports() method,
 * which tells the authentication manager whether or not to use this provider
 * for the given token. In the case of multiple providers,
 * the UserService will then move to the next provider in the list.
 */
export interface AuthProviderInterface {
    support(token);

    /**
     * Should try to auth user with provided token
     * @param {UserTokenInterface} token
     * @return {Promise<UserTokenInterface>}
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    validate(token): Promise<UserTokenInterface | Error>;

    /**
     * Should logout user from the system
     * @param {UserTokenInterface} token
     * @return {Promise<UserTokenInterface>}
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    logout(token?): Promise<UserTokenInterface>;
}

export interface AuthProviderSignupInterface extends AuthProviderInterface {
    signup(token): Promise<UserTokenInterface | Error>;
}

export interface UserTokenInterface<T = any> {
    /**
     * return current user instance
     * @return {*}
     */
    getUser(): T;

    /**
     * return current username
     */
    getUsername(): string;

    /**
     * check if user has role
     * @param name
     */
    hasRole(name): boolean;

    /**
     * is current token is authenticated
     * @return {boolean}
     */
    isAuthenticated(): boolean;
}

/**
 * @class  The interface for the user authentication information.
 */
export class BaseUserToken<T = any> implements UserTokenInterface<T> {
    user = {};

    /**
     * return current user instance
     * @return {*}
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    getUser(): T {
        return this.user as T;
    }

    /**
     * return current username
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    getUsername(): string {
        return 'Anonymous';
    }

    /**
     * check if user has role
     * @param name
     */
    // eslint-disable-next-line no-unused-vars,class-methods-use-this
    hasRole(name): boolean {
        return false;
    }

    /**
     * is current token is authenticated
     * @return {boolean}
     */
    isAuthenticated(): boolean {
        return false;
    }
}
