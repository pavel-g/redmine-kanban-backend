import { Injectable } from '@nestjs/common';
import { RedmineIssueData } from '../model/redmine-issue-data';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { RedisIssuesCacheService } from '../redis-issues-cache/redis-issues-cache.service';

@Injectable()
export class RedmineIssueLoaderService {

  constructor(
    private configService: ConfigService,
    private redisIssuesCache: RedisIssuesCacheService
  ) {
  }

  urlPrefix = this.configService.get<string>('REDMINE_URL_PREFIX')

  async getIssueData(issueNumber: number): Promise<RedmineIssueData|null> {
    const issueExistsInRedis = await this.redisIssuesCache.exists(issueNumber)
    if (issueExistsInRedis) {
      return await this.redisIssuesCache.get(issueNumber)
    }
    const url = this.getUrl(issueNumber)
    const resp = await axios.get(url)
    if (!resp || !resp.data || !resp.data.issue) {
      return null
    }
    const data = resp.data.issue as RedmineIssueData
    await this.redisIssuesCache.save(issueNumber, data)
    return data
  }

  private getUrl(issueNumber: number): string {
    if (typeof this.urlPrefix !== 'string' || this.urlPrefix.length === 0) {
      throw 'REDMINE_URL_PREFIX is undefined'
    }
    return `${this.urlPrefix}/issues/${issueNumber}.json`
  }

}
