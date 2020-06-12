import { NestMiddleware } from '@nestjs/common';
import { LoggerServiceInterface } from '../interfaces';

export class LoggerMiddleware implements NestMiddleware {
    // constructor(private readonly moduleRef: ModuleRef) {}
    constructor(private readonly logger: LoggerServiceInterface) {}

    use(req: Request, res: Response, next: () => void): any {
        this.logger.info(`Request - ${req.method}: ${req.url} `);
        next();
    }
}
