import { Test, TestingModule } from '@nestjs/testing';
import { RedisMergerequestsCacheService } from './redis-mergerequests-cache.service';

describe('RedisMergerequestsCacheService', () => {
  let service: RedisMergerequestsCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisMergerequestsCacheService],
    }).compile();

    service = module.get<RedisMergerequestsCacheService>(RedisMergerequestsCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
