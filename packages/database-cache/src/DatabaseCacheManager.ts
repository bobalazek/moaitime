import { Redis, redis, RedisIORedis } from '@moaitime/redis';

export class DatabaseCacheManager {
  private _client?: RedisIORedis;

  constructor(private _redis: Redis) {}

  async has(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._getClient().exists(key, (err, value) => {
        if (err) {
          return reject(err);
        }

        resolve(!!value);
      });
    });
  }

  async get<T>(key: string): Promise<T | null> {
    return new Promise((resolve, reject) => {
      this._getClient().get(key, (err, value) => {
        if (err) {
          return reject(err);
        }

        resolve(value ? this._redis.parse<T | null>(value) : null);
      });
    });
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<T> {
    return new Promise((resolve, reject) => {
      this._getClient().set(key, this._redis.stringify(value), 'EX', ttlSeconds, (err) => {
        if (err) {
          return reject(err);
        }

        resolve(value);
      });
    });
  }

  // Private
  private _getClient() {
    if (!this._client) {
      this._client = this._redis.getClient();
    }

    return this._client;
  }
}

export const databaseCacheManager = new DatabaseCacheManager(redis);
