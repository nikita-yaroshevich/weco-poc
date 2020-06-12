export class DatabaseException extends Error {
    innerException: any;

    static fromTypeOrmError(e, message?: string): DatabaseException {
        const exception = new DatabaseException(message || e.message || e.hint);
        exception.innerException = e;
        return exception;
    }

    constructor(message) {
        super(message);
    }
}
