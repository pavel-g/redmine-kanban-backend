import { Test, TestingModule } from '@nestjs/testing';
import { RedisIssuesCacheService } from './redis-issues-cache.service';

describe('RedisIssuesCacheService', () => {
  let service: RedisIssuesCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisIssuesCacheService],
    }).compile();

    service = module.get<RedisIssuesCacheService>(RedisIssuesCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
