import { Test, TestingModule } from '@nestjs/testing';
import { RedisMrStatusesCacheService } from './redis-mr-statuses-cache.service';

describe('RedisMrStatusesCacheService', () => {
  let service: RedisMrStatusesCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisMrStatusesCacheService],
    }).compile();

    service = module.get<RedisMrStatusesCacheService>(RedisMrStatusesCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
