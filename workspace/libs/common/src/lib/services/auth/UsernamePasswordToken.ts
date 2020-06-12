import { BaseUserToken } from './common';

export class UsernamePasswordToken extends BaseUserToken<{ username: string }> {
    constructor(public username, public password) {
        super();
        this.user = {
            username
        };
    }
}
