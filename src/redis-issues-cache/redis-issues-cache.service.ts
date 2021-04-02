import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { RedmineIssueData } from '../model/redmine-issue-data';
import { ConfigService } from '@nestjs/config';
import { CacheTtlType } from '../types/cache-ttl-type';
import { RedisAbstractCache } from '../redis-abstract-cache/redis-abstract-cache';

const REDMINE_ISSUES_REDIS_PREFIX = 'issue_'

@Injectable()
export class RedisIssuesCacheService extends RedisAbstractCache<number, RedmineIssueData> {

  keyPrefix = 'issue_';
  redis: RedisService;
  ttl = this.configService.get('REDMINE_ISSUE_CACHE_TTL')

  constructor(
    redis: RedisService,
    private configService: ConfigService
  ) {
    super();
    this.redis = redis
  }

}
