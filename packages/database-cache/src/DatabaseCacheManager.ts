import { Redis, redis, RedisIORedis } from '@moaitime/redis';

export class DatabaseCacheManager {
  private _client?: RedisIORedis;

  constructor(private _redis: Redis) {}

  async exists(key: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._getClient().exists(key, (err, value) => {
        if (err) {
          return reject(err);
        }

        resolve(!!value);
      });
    });
  }

  async get<T>(key: string): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      this._getClient().get(key, (err, value) => {
        if (err) {
          return reject(err);
        }

        const parsedValue = value ? this._redis.parse(value) : undefined;

        resolve(parsedValue as T | undefined);
      });
    });
  }

  async set<T>(key: string, value: T, ttlSeconds: number): Promise<T> {
    return new Promise((resolve, reject) => {
      const stringifiedValue = this._redis.stringify(value);

      this._getClient().set(key, stringifiedValue, 'EX', ttlSeconds, (err) => {
        if (err) {
          return reject(err);
        }

        resolve(value);
      });
    });
  }

  async delete(key: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._getClient().del(key, (err) => {
        if (err) {
          return reject(err);
        }

        resolve();
      });
    });
  }

  async getSet(key: string): Promise<string[] | undefined> {
    return new Promise((resolve, reject) => {
      this._getClient().smembers(key, (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  }

  async addToSet(key: string, value: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      this._getClient().sadd(key, value, (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  }

  async removeFromSet(key: string, value: string): Promise<number | undefined> {
    return new Promise((resolve, reject) => {
      this._getClient().srem(key, value, (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(result);
      });
    });
  }

  async existsInSet(key: string, value: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._getClient().sismember(key, value, (err, result) => {
        if (err) {
          return reject(err);
        }

        resolve(!!result);
      });
    });
  }

  getClient() {
    return this._getClient();
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
