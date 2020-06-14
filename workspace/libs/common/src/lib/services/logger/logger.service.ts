import { LoggerServiceInterface } from '../../interfaces';
import { ConfigServiceInterface } from '../config';

export class LoggerService implements LoggerServiceInterface {
    private logger = console;

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(configService: ConfigServiceInterface) {
    }

    log(level: string, ...data: any[]): LoggerService {
        const msg = data.map(arg => (arg instanceof String || typeof arg === 'string' ? arg : JSON.stringify(arg))).join(' ');
        this.logger.log(level, msg);
        return this;
    }

    error(message: string, ...data: any[]) {
        return this.log('error', message, ...data);
    }

    warn(message: string, ...data: any[]) {
        return this.log('warn', message, ...data);
    }

    info(message: any, ...data: any[]) {
        return this.log('info', message, ...data);
    }

    http(message: string, ...data: any[]) {
        return this.log('http', message, ...data);
    }

    verbose(message: string, ...data: any[]) {
        return this.log('verbose', message, ...data);
    }

    debug(message: string, ...data: any[]) {
        return this.log('debug', message, ...data);
    }

    silly(message: string, ...data: any[]) {
        return this.log('silly', message, ...data);
    }
}
