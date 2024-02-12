import { Channel, connect, Connection, ConsumeMessageFields, MessageProperties } from 'amqplib';
import { parse, stringify } from 'superjson';

import { getEnv } from '@moaitime/shared-backend';

export class RabbitMQ {
  private _connection?: Connection;
  private _channelsMap: Map<string, Channel> = new Map();

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

  async getChannel(channelName: string) {
    const connection = await this.getConnection();

    let channel = this._channelsMap.get(channelName);
    if (!channel) {
      channel = await connection.createChannel();
      await channel.assertQueue(channelName);

      this._channelsMap.set(channelName, channel);
    }

    return channel;
  }

  async consume<T>(
    channelName: string,
    callback: (data: T, fields: ConsumeMessageFields, properties: MessageProperties) => void
  ) {
    const channel = await this.getChannel(channelName);

    return channel.consume(channelName, (msg) => {
      if (msg === null) {
        return;
      }

      callback(parse(msg.content.toString()), msg.fields, msg.properties);

      channel.ack(msg);
    });
  }

  async send(channelName: string, value: Record<string, unknown> | string) {
    const channel = await this.getChannel(channelName);

    if (typeof value !== 'string') {
      value = stringify(value);
    }

    return channel.sendToQueue(channelName, Buffer.from(value));
  }

  async close() {
    for (const channel of this._channelsMap.values()) {
      await channel.close();
    }

    await this._connection?.close();
  }
}

export const rabbitMQ = new RabbitMQ();
