import { redis, Redis } from '@moaitime/redis';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export class GlobalEventNotifier {
  constructor(private _redis: Redis) {}

  async publish<T extends GlobalEventsEnum>(channel: T, message: GlobalEvents[T]) {
    return this._redis.publish<GlobalEvents[T]>(channel, message);
  }

  async subscribe<T extends GlobalEventsEnum>(
    channel: T,
    callback: (message: GlobalEvents[T]) => void
  ) {
    return this._redis.subscribe<GlobalEvents[T]>(channel, callback);
  }

  async unsubscribe<T extends GlobalEventsEnum>(
    channel: T,
    callback: (message: GlobalEvents[T]) => void
  ) {
    return this._redis.unsubscribe<GlobalEvents[T]>(channel, callback);
  }
}

export const globalEventNotifier = new GlobalEventNotifier(redis);
