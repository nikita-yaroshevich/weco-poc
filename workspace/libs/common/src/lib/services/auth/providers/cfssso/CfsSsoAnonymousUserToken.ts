import { AnonymousUserToken } from '../../AnonymousUserToken';

export class CfsSsoAnonymousUserToken extends AnonymousUserToken {
    constructor(public rawJwtToken) {
        super();
    }
}
