import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { LoggerServiceInterface } from '../interfaces';
import { Transformers } from '../../index';

export interface ExceptionsFilterConfig {
    transformer: Transformers.TransformableInterface;
    logger?: LoggerServiceInterface;
    isDetailed?: boolean;
}

export class HttpExceptionsFilter implements ExceptionFilter {
    constructor(private config: ExceptionsFilterConfig) {}

    async catch(except, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let exception = except;
        if (except.toPromise) {
            exception = await except.toPromise();
        }
        const status = exception.getStatus ? exception.getStatus() : this.config.transformer.transform(exception);

        let subError: any = {};
        if (typeof exception === 'string') {
            subError = { message: exception };
        } else if (exception.message) {
            subError = typeof exception.message === 'string' ? { message: exception.message } : exception.message;
        } else {
            subError = { message: 'Internal Server Error' };
        }
        const error = {
            status,
            ...subError,
            timestamp: new Date().toISOString(),
            data: exception.data,
            errors: exception.errors,
            url: request.url,
            ...(this.config.isDetailed ? { debug: exception.stack } : null),
            ...(this.config.isDetailed ? { innerException: exception.innerException || exception } : null)
        };

        this.reportError(error);
        response.status(status).json(error);
    }

    reportError(error) {
        const { logger } = this.config;
        if (logger) {
            logger.error(`Unhandled Exception:`, error);
            if (error.debug) {
                logger.error(error.debug);
            }
        }
    }
}
