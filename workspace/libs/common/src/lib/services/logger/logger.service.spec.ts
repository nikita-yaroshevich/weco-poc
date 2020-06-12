import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { SharedConfigModule } from '../../../../shared-config.module';

describe('LoggerService', () => {
    let service: LoggerService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [SharedConfigModule],
            providers: [LoggerService]
        }).compile();
        service = module.get<LoggerService>(LoggerService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
