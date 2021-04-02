import { RedisService } from '../redis/redis.service';
import { CacheTtlType } from '../types/cache-ttl-type';

export abstract class RedisAbstractCache<K, D> {

  abstract ttl: number
  abstract keyPrefix: string
  abstract redis: RedisService

  async get(key: K): Promise<D> {
    const rawData = await this.redis.get(this.getKey(key))
    const data = JSON.parse(rawData) as D
    return data
  }

  async exists(key: K): Promise<boolean> {
    return await this.redis.exists(this.getKey(key))
  }

  async save(key: K, data: D, ttl: CacheTtlType = 'DEFAULT'): Promise<boolean> {
    let calculatedTtl: number;
    if (ttl === 'INFINITY') {
      calculatedTtl = -1
    } else if (typeof ttl === 'number') {
      calculatedTtl = ttl
    } else {
      calculatedTtl = this.ttl
    }
    return await this.redis.set(
      this.getKey(key),
      JSON.stringify(data),
      calculatedTtl
    )
  }

  async clean(key: K): Promise<boolean> {
    return await this.redis.del(this.getKey(key))
  }

  private getKey(key: K): string {
    return `${this.keyPrefix}${key}`
  }

}