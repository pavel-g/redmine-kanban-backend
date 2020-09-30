import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require("redis")

@Injectable()
export class RedisService {

  protected redis: any; //Redis.RedisClient;

  private host = this.configService.get<string>('REDIS_HOST')
  private port = this.configService.get<number>('REDIS_PORT')

  constructor(private configService: ConfigService) {
  }

  getRedis(): any {
    if (!this.redis) {
      this.redis = Redis.createClient(this.port, this.host)
      this.redis.on('error', (err) => {
        console.error('Redis client error: ' + err)
      })
    }
    return this.redis
  }

  exists(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getRedis().exists(key, (err, res) => {
        console.log(`check exists ${key}:`, {err: err, res: res}) // DEBUG
        if (err != null && typeof err != 'undefined') return resolve(false)
        if (res > 0) return resolve(true)
        return resolve(false)
      })
    })
  }

  get(key: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.getRedis().get(key, (err, value) => {
        if (err) {
          reject(err)
          return
        }
        if (value === null) {
          reject(`Record by key=${key} not found`)
          return
        }
        resolve(value)
      })
    })
  }

  set(key: string, value: string, duration: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.getRedis().set(key, value, 'EX', duration, (err, res) => {
        resolve(!err && res === "OK")
      })
    })
  }

  del(key: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.getRedis().del(key, (err) => {
        (err) ? resolve(false) : resolve(true)
      })
    })
  }

}
