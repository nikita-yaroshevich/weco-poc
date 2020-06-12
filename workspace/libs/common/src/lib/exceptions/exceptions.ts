import { HttpStatus } from '@nestjs/common';
import * as Inflector from 'inflected';

export class DuplicateEntityException extends Error {
    type = DuplicateEntityException.name;
    constructor(message) {
        super(message);
    }
}

export class NotFoundException extends Error {
    type = NotFoundException.name;
    constructor(message?: string, public readonly data?: any) {
        super(message);
    }
}

export class NotSupportedException extends Error {
    type = NotSupportedException.name;
    constructor(message?: string) {
        super(message);
    }
}

export class LogicException extends Error {
    type = LogicException.name;
    constructor(message?: string) {
        super(message);
    }
}

export class InvalidConfigurationException extends Error {
    type = InvalidConfigurationException.name;
    constructor(message?: string, public readonly data?: any) {
        super(message);
    }
}

export class RuntimeException extends Error {
    type = RuntimeException.name;
    constructor(message?: string, public readonly data?: any) {
        super(message);
    }
}

export class InvalidCredentialsException extends Error {
    tyep = InvalidCredentialsException.name;
    constructor(message?: string, public readonly data?: any) {
        super(message);
    }
}

export class NotImplementedException extends Error {
    type = NotImplementedException.name;
    constructor(message?: string, public readonly data?: any) {
        super(message);
    }
}

export class HttpException extends Error {
    public readonly type = HttpException.name;
    public readonly status: number;
    public readonly statusText: any;

    constructor(
        message: string,
        public readonly response: { data?: any; status: number },
        public readonly request: { url: string; data?: any; method?: string }
    ) {
        super(message);
        this.status = this.response.status;
        this.statusText = Inflector.humanize(HttpStatus[this.status]);
    }
}
