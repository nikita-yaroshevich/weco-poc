export class ValidationException extends Error {
    type = ValidationException.name;
    innerException: any;
    status = 422;
    errors: { property: string; message: string; [prop: string]: any }[] = [];
    originalData?: any;

    constructor(message) {
        super(message);
    }
}
