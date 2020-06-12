import * as bcrypt from 'bcrypt-nodejs';

export function hashString(str: string, salt: string): string {
    return bcrypt.hashSync(str, salt);
}

export function compareHashString(str: string, hash: string): boolean {
    return bcrypt.compareSync(str, hash);
}

export function generateSalt(): string {
    return bcrypt.genSaltSync(12);
}

export function toBool(value: string | number | boolean | null | undefined): boolean {
    try {
        if (value === 'true') {
            return true;
        }
        return typeof value === 'string'
            ? !!+value // we parse string to integer first
            : !!value;
    } catch (e) {
        return false;
    }
}
