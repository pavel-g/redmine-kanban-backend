import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { RedmineIssueData } from '../model/redmine-issue-data';
import { ConfigService } from '@nestjs/config';

const REDMINE_ISSUES_REDIS_PREFIX = 'issue_'

@Injectable()
export class RedisIssuesCacheService {

  constructor(
    private redis: RedisService,
    private configService: ConfigService
  ) {
  }

  private redmineIssueCacheTtl = this.configService.get<number>('REDMINE_ISSUE_CACHE_TTL', 300)

  async get(id: number): Promise<RedmineIssueData> {
    const key = `${REDMINE_ISSUES_REDIS_PREFIX}${id}`
    const rawData = await this.redis.get(key)
    const data = JSON.parse(rawData) as RedmineIssueData
    return data
  }

  async exists(id: number): Promise<boolean> {
    const key = `${REDMINE_ISSUES_REDIS_PREFIX}${id}`
    const res = await this.redis.exists(key)
    console.log(`check exists issue ${id}: ${res}`) // DEBUG
    return res
  }

  async save(id: number, data: RedmineIssueData): Promise<boolean> {
    const key = `${REDMINE_ISSUES_REDIS_PREFIX}${id}`
    return await this.redis.set(key, JSON.stringify(data), this.redmineIssueCacheTtl)
  }

  async clean(id: number): Promise<boolean> {
    const key = `${REDMINE_ISSUES_REDIS_PREFIX}${id}`
    return await this.redis.del(key)
  }

}
