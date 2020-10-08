import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { RedmineUser } from '../model/redmine-user';

const REDMINE_USERS_REDIS_PREFIX = 'redmine_user_'

@Injectable()
export class RedisUsersCacheService {

  constructor(
    private redis: RedisService,
    private configService: ConfigService
  ) {
  }

  private redmineUserCacheTtl = this.configService.get<number>('REDMINE_USER_CACHE_TTL', 86400)

  async get(id: number): Promise<RedmineUser> {
    const key = this.getKey(id)
    const rawData = await this.redis.get(key)
    const data = JSON.parse(rawData) as RedmineUser
    return data
  }

  async exists(id: number): Promise<boolean> {
    const key = this.getKey(id)
    return await this.redis.exists(key)
  }

  async save(id: number, data: RedmineUser): Promise<boolean> {
    const key = this.getKey(id)
    const rawData = JSON.stringify(data)
    return await this.redis.set(key, rawData, this.redmineUserCacheTtl)
  }

  async clean(id: number): Promise<boolean> {
    const key = this.getKey(id)
    return await this.redis.del(key)
  }

  private getKey(id: number): string {
    return `${REDMINE_USERS_REDIS_PREFIX}${id}`
  }

}
