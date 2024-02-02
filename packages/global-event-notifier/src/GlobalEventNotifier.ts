import { logger } from '@moaitime/logging';
import { redis, Redis } from '@moaitime/redis';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

const GLOBAL_EVENTS_CHANNEL = 'global-events';

export class GlobalEventNotifier {
  constructor(private _redis: Redis) {}

  async publish<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    logger.debug(`[GlobalEventNotifier] Publishing global event (${type}) ...`);

    return this._redis.publish(GLOBAL_EVENTS_CHANNEL, JSON.stringify({ type, payload }));
  }

  subscribe<T extends GlobalEventsEnum>(
    type: T | '*',
    callback: (message: { type: T; payload: GlobalEvents[T] }) => void
  ) {
    logger.debug(`[GlobalEventNotifier] Subscribing to global event (${type}) ...`);

    // TODO: that at the moment is not compatible if we have multiple subscribers,
    // as when we unsubscribe we remove all the subscribers
    const wrappedCallback = (message: string) => {
      const parsedMessage = JSON.parse(message) as { type: T; payload: GlobalEvents[T] };

      if (type === '*' || parsedMessage.type === type) {
        callback(parsedMessage);
      }
    };

    this._redis.subscribe(GLOBAL_EVENTS_CHANNEL, wrappedCallback);

    return () => {
      logger.debug(`[GlobalEventNotifier] Unsubscribing from global events ...`);

      this._redis.unsubscribe(GLOBAL_EVENTS_CHANNEL, wrappedCallback);
    };
  }
}

export const globalEventNotifier = new GlobalEventNotifier(redis);
