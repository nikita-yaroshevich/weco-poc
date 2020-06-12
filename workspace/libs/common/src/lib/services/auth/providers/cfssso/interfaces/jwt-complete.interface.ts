import { JwtPayload } from './jwt-payload.interface';

export interface JwtCompleteInterface {
    header: {
        kid: string;
        alg: string;
    };
    payload: JwtPayload;
    signature: string;
}
