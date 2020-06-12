import * as correlator from 'correlation-id';
import { createLogger, format, Logger, transports } from 'winston';
import { LoggerServiceInterface } from '../../interfaces';
import { ConfigServiceInterface } from '../config';

export class LoggerService implements LoggerServiceInterface {
    private logger: Logger;

    constructor(configService: ConfigServiceInterface) {
        const options = configService.get('winston');
        const logFormat = format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss:SSSS'
            }),
            format.printf(
                info => `${configService.get('APP_NAME', '')} - [${info.timestamp}] [${correlator.getId()}] [${info.level}] - ${info.message}`
            )
        );

        this.logger = createLogger({
            transports: [
                new transports.Console({
                    format: logFormat,
                    level: options.level
                })
            ]
        });
    }

    get level() {
        return this.logger.level;
    }

    get isProd() {
        return this.logger.levels[this.logger.level] === 0;
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
