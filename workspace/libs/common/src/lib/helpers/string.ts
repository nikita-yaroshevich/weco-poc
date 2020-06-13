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
