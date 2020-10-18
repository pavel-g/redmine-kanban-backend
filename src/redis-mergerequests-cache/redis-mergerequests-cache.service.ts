import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { RedisAbstractCache } from '../redis-abstract-cache/redis-abstract-cache';

@Injectable()
export class RedisMergerequestsCacheService extends RedisAbstractCache<number, number[]>{

  ttl: number = this.configService.get('REDMINE_ISSUE_MERGE_REQUESTS_TTL', 300);
  redis: RedisService;
  keyPrefix = 'issue_mergerequests_'

  constructor(
    redis: RedisService,
    private configService: ConfigService
  ) {
    super()
    this.redis = redis
  }

}
