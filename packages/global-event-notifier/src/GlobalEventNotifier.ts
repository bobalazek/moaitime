import { logger } from '@moaitime/logging';
import { RabbitMQ, rabbitMQ } from '@moaitime/rabbitmq';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

const GLOBAL_EVENTS_CHANNEL = 'global-events';

export class GlobalEventNotifier {
  constructor(private _rabbitMQ: RabbitMQ) {}

  async publish<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    logger.debug(`[GlobalEventNotifier] Publishing global event (${type}) ...`);

    return this._rabbitMQ.send(GLOBAL_EVENTS_CHANNEL, { type, payload });
  }

  async subscribe<T extends GlobalEventsEnum>(
    type: T | '*',
    callback: (message: { type: T; payload: GlobalEvents[T] }) => void
  ) {
    logger.debug(`[GlobalEventNotifier] Subscribing to global event (${type}) ...`);

    // TODO: that at the moment is not compatible if we have multiple subscribers,
    // as when we unsubscribe we remove all the subscribers
    const wrappedCallback = (message: unknown) => {
      const parsedMessage = message as { type: T; payload: GlobalEvents[T] };

      if (type === '*' || parsedMessage.type === type) {
        callback(parsedMessage);
      }
    };

    const unsubscribe = await this._rabbitMQ.consume(GLOBAL_EVENTS_CHANNEL, wrappedCallback);

    return async () => {
      logger.debug(`[GlobalEventNotifier] Unsubscribing from global events ...`);

      unsubscribe();
    };
  }
}

export const globalEventNotifier = new GlobalEventNotifier(rabbitMQ);
