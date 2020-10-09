import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisUsersCacheService } from '../redis-users-cache/redis-users-cache.service';
import { RedmineUser } from '../model/redmine-user';
import axios from 'axios';
import { AllRedmineUsersData } from '../model/all-redmine-users-data';

@Injectable()
export class RedmineUsersLoaderService {

  constructor(
    private configService: ConfigService,
    private redisUsersCache: RedisUsersCacheService
  ) {
  }

  urlPrefix = this.configService.get<string>('REDMINE_URL_PREFIX')

  async getUsersData(userIds: number[]): Promise<RedmineUser[]> {
    const promises = userIds.map(userId => this.getUserData(userId))
    return await Promise.all(promises)
  }

  async getUserData(userId: number): Promise<RedmineUser|null> {
    const userExistsInRedis = await this.redisUsersCache.exists(userId)
    if (userExistsInRedis) {
      return await this.redisUsersCache.get(userId)
    }

    const url = this.getUrl(userId)
    const resp = await axios.get<{user: RedmineUser}>(url)
    const userData = resp.data.user
    await this.redisUsersCache.save(userId, userData)
    return userData
  }

  private getUrl(userId: number): string {
    if (typeof this.urlPrefix !== 'string' || this.urlPrefix.length === 0) {
      throw new Error("REDMINE_URL_PREFIX is undefined")
    }
    return `${this.urlPrefix}/users/${userId}.json`
  }

}
