import { CfsSsoUserToken } from './CfsSsoUserToken';
import { AnonymousUserToken } from '../../AnonymousUserToken';
import { CfsSsoAnonymousUserToken } from './CfsSsoAnonymousUserToken';
import * as jwkToPem from 'jwk-to-pem';
import { JwtService } from '@nestjs/jwt';
import { AuthProviderInterface, UserTokenInterface } from '../../common';
import { CacheProviderInterface, CacheService } from '../../../cache';
import { map } from 'rxjs/operators';
import { InvalidCredentialsException } from '../../../../exceptions';
import { HttpService } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';
import { JwtCompleteInterface } from './interfaces/jwt-complete.interface';

export interface EnterpriseUserInterface {
    username: string;
    roles: string[];
    profile?: {
        firstName?: string;
        lastName?: string;
        locale?: string;
    };
}

interface CfsSsoAuthProviderConfig {
    SSO_SERVICE_API: string;
    MAX_CACHE_TTL: number;
}

export class CfsSsoAuthProvider implements AuthProviderInterface {
    static STORAGE_KEY = 'CFSSSO_AUTH_PROVIDER';

    constructor(
        private readonly config: CfsSsoAuthProviderConfig,
        private http: HttpService,
        private readonly jwtService: JwtService,
        private cache: CacheService
    ) {}

    get storage(): CacheProviderInterface {
        return this.cache.getBucket(CfsSsoAuthProvider.STORAGE_KEY);
    }

    /**
     *
     * @param {CfsSsoAnonymousUserToken | CfsSsoUserToken} token
     */
    support(token) {
        return token instanceof CfsSsoAnonymousUserToken || token instanceof CfsSsoUserToken;
    }

    /**
     *
     * @param {UsernamePasswordToken} token
     * @return Promise{EnterpriseUserToken|Error}
     */
    async validate(token): Promise<UserTokenInterface | Error> {
        if (token instanceof CfsSsoUserToken) {
            return token;
        }

        let keyList = null;
        try {
            keyList = await this.loadKeyList();
        } catch (e) {
            throw new InvalidCredentialsException('Invalid token');
        }
        if (token instanceof CfsSsoAnonymousUserToken) {
            const decodedJwt = this.jwtService.decode(token.rawJwtToken, { complete: true }) as JwtCompleteInterface;
            if (!decodedJwt || !decodedJwt.header) {
                throw new InvalidCredentialsException('Invalid token');
            }

            const pubKeyObject = keyList.filter(key => key.kid === decodedJwt.header.kid);

            if (pubKeyObject.length === 1) {
                return new CfsSsoUserToken(this.publicKeyPem(pubKeyObject[0]), decodedJwt.payload);
            } else {
                throw new InvalidCredentialsException('Invalid token');
            }
        }
    }

    logout(token): Promise<UserTokenInterface> {
        return new Promise(resolve => {
            // this.storage.clear();
            resolve(new AnonymousUserToken());
        });
    }

    private async loadKeyList() {
        const httpCfg: AxiosRequestConfig = {
            baseURL: this.config.SSO_SERVICE_API,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return this.storage
            .get(
                'PUBLIC_KEY_LIST',
                this.http.get('/v1/key-service/list', httpCfg).pipe(map((r: any) => (r.data || r).keys)),
                this.config.MAX_CACHE_TTL || 8.64e7
            )
            .toPromise();
    }

    private publicKeyPem(key: object): string {
        return jwkToPem(key);
    }

    secretOrKeyProvider = async (request, rawJwtToken, done): Promise<string> => {
        try {
            const token = await this.validate(new CfsSsoAnonymousUserToken(rawJwtToken));
            return done(null, (token as CfsSsoUserToken).pem);
        } catch (e) {
            return done(e.message || e.toString() || e);
        }
    };
}
