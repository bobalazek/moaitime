import {
  Channel,
  connect,
  Connection,
  ConsumeMessage,
  ConsumeMessageFields,
  MessageProperties,
} from 'amqplib';
import { parse, stringify } from 'superjson';

import { shutdownManager, ShutdownManager } from '@moaitime/processes';
import { getEnv } from '@moaitime/shared-backend';

export {
  Channel as RabbitMQChannel,
  ConsumeMessage as RabbitMQConsumeMessage,
  ConsumeMessageFields as RabbitMQConsumeMessageFields,
  MessageProperties as RabbitMQMessageProperties,
};

export class RabbitMQ {
  private _connection?: Connection;

  constructor(private _shutdownManager: ShutdownManager) {
    this._shutdownManager.registerTask(
      'RabbitMQ:Terminate',
      this.terminate.bind(this),
      // This needs to have lower priority, so it will be terminated last,
      // as it could be, that some other services may still use it
      -16
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async connect(socketOptions?: any) {
    if (!this._connection) {
      const { RABBITMQ_URL } = getEnv();

      this._connection = await connect(RABBITMQ_URL, socketOptions);
    }

    return this._connection;
  }

  async getConnection() {
    return this.connect();
  }

  async terminate() {
    await this._connection?.close();
  }

  // Helpers
  stringify(value: Record<string, unknown>) {
    return stringify(value);
  }

  parse<T>(value: string) {
    return parse<T>(value);
  }
}

export const rabbitMQ = new RabbitMQ(shutdownManager);
