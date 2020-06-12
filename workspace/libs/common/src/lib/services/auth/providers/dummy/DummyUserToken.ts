import { BaseUserToken } from '../../common';

export interface DummyUser {
    username: string;
    roles: string[];
    payload: any;
}

export class DummyUserToken extends BaseUserToken<DummyUserToken> {
    user: DummyUser;
    constructor(userData: DummyUser) {
        super();
        this.user = userData;
    }

    getUsername(): string {
        return this.user.username;
    }

    isAuthenticated() {
        return true;
    }

    hasRole(name = '*') {
        if (!this.user.roles) {
            return false;
        }
        return name === '*' || this.user.roles.indexOf(name) !== -1;
    }
}
