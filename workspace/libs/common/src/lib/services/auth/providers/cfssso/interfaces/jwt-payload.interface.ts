export interface JwtPayload {
    sub: string;
    aud: string;
    email_verified: true;
    event_id: string;
    token_use: string;
    auth_time: number;
    iss: string;
    'cognito:username': string;
    exp: number;
    'custom:idx_id': string;
    iat: number;
    email: string;
}
