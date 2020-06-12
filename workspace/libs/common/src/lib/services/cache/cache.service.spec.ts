import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';

describe('CacheService', () => {
    let service: CacheService;
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: CacheService,
                    useValue: new CacheService()
                }
            ]
        }).compile();
        service = module.get<CacheService>(CacheService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
