import { Test, TestingModule } from '@nestjs/testing';
import { RedisUsersCacheService } from './redis-users-cache.service';

describe('RedisUsersCacheService', () => {
  let service: RedisUsersCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisUsersCacheService],
    }).compile();

    service = module.get<RedisUsersCacheService>(RedisUsersCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
