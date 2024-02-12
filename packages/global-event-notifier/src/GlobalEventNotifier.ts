import { logger } from '@moaitime/logging';
import { RabbitMQ, rabbitMQ, RabbitMQChannel, RabbitMQConsumeMessage } from '@moaitime/rabbitmq';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export const GLOBAL_EVENTS_EXCHANGE = 'global-events-exchange';

export enum GlobalEventNotifierQueueEnum {
  WEBSOCKET = 'global-events-websocket-queue',
  JOB_RUNNER = 'global-events-job-runner-queue',
}

export class GlobalEventNotifier {
  private _channel?: RabbitMQChannel;

  constructor(private _rabbitMQ: RabbitMQ) {}

  async publish<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    logger.debug(`[GlobalEventNotifier] Publishing global event (${type}) ...`);

    return this._publishToExchange(type, payload);
  }

  async subscribe<T extends GlobalEventsEnum>(
    queue: GlobalEventNotifierQueueEnum,
    type: T | '*',
    callback: (message: { type: T; payload: GlobalEvents[T] }) => void
  ) {
    logger.debug(`[GlobalEventNotifier] Subscribing to global event (${type}) ...`);

    const channel = await this._getChannel();

    channel?.consume(queue, (message: RabbitMQConsumeMessage | null) => {
      if (!message) {
        return;
      }

      const parsedMessage = this._rabbitMQ.parse<{ type: T; payload: GlobalEvents[T] }>(
        message.content.toString()
      );

      logger.debug(`[GlobalEventNotifier] Received global event "${parsedMessage.type}" ...`);

      if (type === '*' || parsedMessage.type === type) {
        callback(parsedMessage);
      }

      channel.ack(message);
    });

    return async () => {
      logger.debug(`[GlobalEventNotifier] Unsubscribing from global events ...`);

      await channel?.close();
    };
  }

  // Private
  async _getChannel() {
    if (!this._channel) {
      const connection = await this._rabbitMQ.getConnection();

      connection.on('error', (error) => {
        logger.error(`[GlobalEventNotifier] Connection error: ${error.message}`);
      });

      this._channel = await connection.createChannel();

      await this._channel.assertExchange(GLOBAL_EVENTS_EXCHANGE, 'fanout', { durable: true });

      await this._channel.assertQueue(GlobalEventNotifierQueueEnum.WEBSOCKET, { durable: true });
      await this._channel.assertQueue(GlobalEventNotifierQueueEnum.JOB_RUNNER, { durable: true });

      await this._channel.bindQueue(
        GlobalEventNotifierQueueEnum.WEBSOCKET,
        GLOBAL_EVENTS_EXCHANGE,
        ''
      );
      await this._channel.bindQueue(
        GlobalEventNotifierQueueEnum.JOB_RUNNER,
        GLOBAL_EVENTS_EXCHANGE,
        ''
      );
    }

    return this._channel;
  }

  async _publishToExchange<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    const channel = await this._getChannel();

    return channel.publish(
      GLOBAL_EVENTS_EXCHANGE,
      '',
      Buffer.from(this._rabbitMQ.stringify({ type, payload }))
    );
  }
}

export const globalEventNotifier = new GlobalEventNotifier(rabbitMQ);
