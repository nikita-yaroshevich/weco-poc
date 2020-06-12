import { Injectable, NestMiddleware } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(private readonly moduleRef: ModuleRef) {}

    private _logger: LoggerService = null;

    get logger(): LoggerService {
        if (!this._logger) {
            this._logger = this.moduleRef.get(LoggerService);
        }
        return this._logger;
    }

    use(req: Request, res: Response, next: () => void): any {
        this.logger.info(`Request - ${req.method}: ${req.url} `);
        next();
        this.logger.info(`Response - ${req.method}: ${req.url}`);
    }
}
