import { UserTokenInterface } from './common';

export class AuthUserToken implements UserTokenInterface {
    constructor(data?: Partial<AuthUserToken> | any) {
        Object.keys(data || {}).forEach(key => (this[key] = data[key]));
    }
    userId: string;
    roles: string[] = [];
    user?: any;

    getUserIdentity(): string {
        return this.userId;
    }
    getUser() {
        return this.user || {};
    }

    getUsername(): string {
        return this.getUser().username || 'Unknown';
    }

    hasRole(name): boolean {
        if (!this.user.roles) {
            return false;
        }
        return name === '*' || this.user.roles.indexOf(name) !== -1;
    }

    isAuthenticated(): boolean {
        return true;
    }
}
