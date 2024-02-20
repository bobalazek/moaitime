import { Logger, logger } from '@moaitime/logging';
import { RabbitMQ, rabbitMQ, RabbitMQChannel, RabbitMQConsumeMessage } from '@moaitime/rabbitmq';
import { Redis, redis } from '@moaitime/redis';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export const GLOBAL_EVENTS_QUEUE = 'global-events-queue';

export class GlobalEventsNotifier {
  private _rabbitMQChannel?: RabbitMQChannel;
  private _additionalPayload?: Record<string, unknown>;

  constructor(
    private _logger: Logger,
    private _rabbitMQ: RabbitMQ,
    private _redis: Redis
  ) {}

  async publish<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    this._logger.debug(`[GlobalEventsNotifier] Publishing global event (${type}) ...`);

    const finalPayload = {
      ...payload,
      ...this._additionalPayload,
    };

    await this._publishToQueue(type, finalPayload);
    await this._publishToPubSub(type, finalPayload);
  }

  async subscribeToQueue<T extends GlobalEventsEnum>(
    type: T | '*',
    callback: (message: { type: T; payload: GlobalEvents[T] }) => Promise<void>
  ) {
    this._logger.debug(`[GlobalEventsNotifier] Subscribing to global event (${type}) queue ...`);

    const channel = await this._getChannel();

    channel?.consume(GLOBAL_EVENTS_QUEUE, async (message: RabbitMQConsumeMessage | null) => {
      if (!message) {
        return;
      }

      const parsedMessage = this._rabbitMQ.parse<{ type: T; payload: GlobalEvents[T] }>(
        message.content.toString()
      );

      this._logger.debug(
        `[GlobalEventsNotifier] Received global event "${parsedMessage.type}" on queue ...`
      );

      if (type === '*' || parsedMessage.type === type) {
        await callback(parsedMessage);
      }

      channel.ack(message);
    });

    return async () => {
      this._logger.debug(`[GlobalEventsNotifier] Unsubscribing from global events queue ...`);

      await channel?.close();
    };
  }

  async subscribeToPubSub<T extends GlobalEventsEnum>(
    type: T | '*',
    callback: (message: { type: T; payload: GlobalEvents[T] }) => Promise<void>
  ) {
    this._logger.debug(`[GlobalEventsNotifier] Subscribing to global event (${type}) pub sub ...`);

    const wrapperCallback = async (message: { type: T; payload: GlobalEvents[T] }) => {
      this._logger.debug(
        `[GlobalEventsNotifier] Received global event "${message.type}" on pub sub ...`
      );

      if (type === '*' || message.type === type) {
        await callback(message);
      }
    };

    this._redis.subscribe(GLOBAL_EVENTS_QUEUE, wrapperCallback);

    return async () => {
      this._logger.debug(`[GlobalEventsNotifier] Unsubscribing from global events pub sub ...`);

      this._redis.unsubscribe(GLOBAL_EVENTS_QUEUE, wrapperCallback);
    };
  }

  setAdditionalPayload(payload: Record<string, unknown>) {
    this._additionalPayload = payload;
  }

  // Private
  // RabbitMQ
  async _getChannel() {
    if (!this._rabbitMQChannel) {
      const connection = await this._rabbitMQ.getConnection();

      connection.on('error', (error) => {
        this._logger.error(error, `[GlobalEventsNotifier] Connection error: ${error.message}`);
      });

      connection.on('close', () => {
        this._logger.error(`[GlobalEventsNotifier] Connection closed`);
      });

      this._rabbitMQChannel = await connection.createChannel();

      await this._rabbitMQChannel.assertQueue(GLOBAL_EVENTS_QUEUE, { durable: true });
    }

    return this._rabbitMQChannel;
  }

  async _publishToQueue<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    const channel = await this._getChannel();
    return channel.sendToQueue(
      GLOBAL_EVENTS_QUEUE,
      Buffer.from(this._rabbitMQ.stringify({ type, payload }))
    );
  }

  // Redis
  async _publishToPubSub<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    return this._redis.publish(GLOBAL_EVENTS_QUEUE, {
      type,
      payload,
    });
  }
}

export const globalEventsNotifier = new GlobalEventsNotifier(logger, rabbitMQ, redis);
