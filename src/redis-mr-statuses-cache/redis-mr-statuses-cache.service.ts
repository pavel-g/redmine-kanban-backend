import { Injectable } from '@nestjs/common';
import { RedisAbstractCache } from '../redis-abstract-cache/redis-abstract-cache';
import { MergeRequestStatuses } from '../model/mergerequest-statuses';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisMrStatusesCacheService extends RedisAbstractCache<number, MergeRequestStatuses> {

  keyPrefix = 'mergerequest_statuses_'
  redis: RedisService;
  ttl = this.configService.get('GITTAB_MERGE_REQUEST_STATUSES_TTL', 300);

  constructor(
    redis: RedisService,
    private configService: ConfigService
  ) {
    super();
    this.redis = redis
  }

}
