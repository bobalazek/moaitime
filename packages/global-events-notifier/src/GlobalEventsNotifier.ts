import { Logger, logger } from '@moaitime/logging';
import { RabbitMQ, rabbitMQ, RabbitMQChannel, RabbitMQConsumeMessage } from '@moaitime/rabbitmq';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export const GLOBAL_EVENTS_EXCHANGE = 'global-events-exchange';

export enum GlobalEventsNotifierQueueEnum {
  WEBSOCKET = 'global-events-websocket-queue',
  JOB_RUNNER = 'global-events-job-runner-queue',
}

export class GlobalEventsNotifier {
  private _channel?: RabbitMQChannel;

  constructor(
    private _logger: Logger,
    private _rabbitMQ: RabbitMQ
  ) {}

  async publish<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    this._logger.debug(`[GlobalEventsNotifier] Publishing global event (${type}) ...`);

    return this._publishToExchange(type, payload);
  }

  async subscribe<T extends GlobalEventsEnum>(
    queue: GlobalEventsNotifierQueueEnum,
    type: T | '*',
    callback: (message: { type: T; payload: GlobalEvents[T] }) => Promise<void>
  ) {
    this._logger.debug(`[GlobalEventsNotifier] Subscribing to global event (${type}) ...`);

    const channel = await this._getChannel();

    channel?.consume(queue, async (message: RabbitMQConsumeMessage | null) => {
      if (!message) {
        return;
      }

      const parsedMessage = this._rabbitMQ.parse<{ type: T; payload: GlobalEvents[T] }>(
        message.content.toString()
      );

      this._logger.debug(
        `[GlobalEventsNotifier] Received global event "${parsedMessage.type}" ...`
      );

      if (type === '*' || parsedMessage.type === type) {
        await callback(parsedMessage);
      }

      channel.ack(message);
    });

    return async () => {
      this._logger.debug(`[GlobalEventsNotifier] Unsubscribing from global events ...`);

      await channel?.close();
    };
  }

  // Private
  async _getChannel() {
    if (!this._channel) {
      const connection = await this._rabbitMQ.getConnection();

      connection.on('error', (error) => {
        this._logger.error(`[GlobalEventsNotifier] Connection error: ${error.message}`);
      });

      connection.on('close', () => {
        this._logger.error(`[GlobalEventsNotifier] Connection closed`);
      });

      this._channel = await connection.createChannel();

      await this._channel.assertExchange(GLOBAL_EVENTS_EXCHANGE, 'fanout', { durable: true });

      await this._channel.assertQueue(GlobalEventsNotifierQueueEnum.WEBSOCKET, { durable: false });
      await this._channel.assertQueue(GlobalEventsNotifierQueueEnum.JOB_RUNNER, { durable: true });

      await this._channel.bindQueue(
        GlobalEventsNotifierQueueEnum.WEBSOCKET,
        GLOBAL_EVENTS_EXCHANGE,
        ''
      );
      await this._channel.bindQueue(
        GlobalEventsNotifierQueueEnum.JOB_RUNNER,
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

export const globalEventsNotifier = new GlobalEventsNotifier(logger, rabbitMQ);
