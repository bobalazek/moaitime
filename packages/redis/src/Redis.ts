import IORedis, { RedisOptions } from 'ioredis';
import { parse, stringify } from 'superjson';

import { getEnv } from '@moaitime/shared-backend';

export { IORedis as RedisIORedis };

export type EventNotifierCallback<T = unknown> = (message: T) => void;

export class Redis {
  private _client?: IORedis;
  private _pubClient?: IORedis;
  private _subClient?: IORedis;

  private _subscribersMap: Map<string, EventNotifierCallback[]> = new Map();

  getClient() {
    if (!this._client) {
      this._client = this.createClient({
        keyPrefix: `${getEnv().NODE_ENV}:`,
      });
    }

    return this._client;
  }

  getPubClient() {
    if (!this._pubClient) {
      const client = this.getClient();
      this._pubClient = client.duplicate();
    }

    return this._pubClient;
  }

  getSubClient() {
    if (!this._subClient) {
      const client = this.getClient();
      this._subClient = client.duplicate();
    }

    return this._subClient;
  }

  createClient(options: RedisOptions) {
    return new IORedis(getEnv().REDIS_URL, options);
  }

  async terminate() {
    await this._client?.quit();
  }

  /********** PubSub **********/
  publish<T>(channel: string, message: T) {
    const pubClient = this.getPubClient();
    const serializedMessage = stringify(message);

    pubClient.publish(channel, serializedMessage);
  }

  subscribe<T>(channel: string, callback: EventNotifierCallback<T>) {
    if (!this._subscribersMap.has(channel)) {
      const subClient = this.getSubClient();

      subClient.subscribe(channel);
      subClient.on('message', (chan, serializedMessage) => {
        if (chan !== channel) {
          return;
        }

        const message = parse(serializedMessage) as T;
        this._subscribersMap
          .get(channel)
          ?.forEach((cb) => (cb as EventNotifierCallback<T>)(message));
      });

      this._subscribersMap.set(channel, []);
    }

    const existingCallbacks = this._subscribersMap.get(channel) || [];

    this._subscribersMap.set(channel, [...existingCallbacks, callback as EventNotifierCallback]);
  }

  unsubscribe<T>(channel: string, callback: EventNotifierCallback<T>) {
    const existingCallbacks = this._subscribersMap.get(channel);
    if (!existingCallbacks || existingCallbacks.length === 0) {
      return;
    }

    const filteredCallbacks = existingCallbacks.filter((cb) => cb !== callback);
    if (filteredCallbacks.length === 0) {
      const subClient = this.getSubClient();

      subClient.unsubscribe(channel);

      this._subscribersMap.delete(channel);
    } else {
      this._subscribersMap.set(channel, filteredCallbacks);
    }
  }

  /********** Queues **********/
  async getQueueLength(queueName: string): Promise<number> {
    const client = this.getClient();

    return client.llen(queueName);
  }

  async enqueue(queueName: string, value: string): Promise<boolean> {
    const client = this.getClient();

    await client.rpush(queueName, value);

    return true;
  }

  async dequeue(queueName: string): Promise<string | null> {
    const client = this.getClient();

    const value = await client.lpop(queueName);

    return value;
  }

  async enqueueDeduped(queueName: string, value: string): Promise<boolean> {
    const client = this.getClient();
    const dedupeSetName = `${queueName}:dedupeSet`;
    const exists = await client.sismember(dedupeSetName, value);
    if (exists) {
      return false;
    }

    await client.sadd(dedupeSetName, value);
    await client.rpush(queueName, value);

    return true;
  }

  async dequeueDeduped(queueName: string): Promise<string | null> {
    const client = this.getClient();
    const dedupeSetName = `${queueName}:dedupeSet`;
    const dequeuedValue = await client.lpop(queueName);
    if (dequeuedValue) {
      await client.srem(dedupeSetName, dequeuedValue);
    }

    return dequeuedValue;
  }

  async clearQueue(queueName: string): Promise<void> {
    const client = this.getClient();
    await client.del(queueName);

    const dedupeSetName = `${queueName}:dedupeSet`;
    await client.del(dedupeSetName);
  }
}

export const redis = new Redis();
