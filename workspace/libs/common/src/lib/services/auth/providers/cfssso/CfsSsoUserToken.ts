import { UserTokenInterface } from '../../common';
import { JwtPayload } from './interfaces/jwt-payload.interface';

export class CfsSsoUserToken implements UserTokenInterface {
    constructor(public pem, public payload: JwtPayload) {}

    isAuthenticated() {
        return true;
    }

    hasRole(name = '*') {
        return false;
    }

    getUsername() {
        try {
            return this.payload['cognito:username'];
        } catch (e) {
            return 'Unknown';
        }
    }

    getUser() {
        return undefined;
    }
}
