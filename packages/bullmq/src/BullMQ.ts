import type { JobsOptions, JobType, Processor, QueueOptions, WorkerOptions } from 'bullmq';

import { Job, Queue, Worker } from 'bullmq';

import { Redis, redis, RedisIORedis } from '@moaitime/redis';

export {
  Queue as BullMQQueue,
  Worker as BullMQWorker,
  Job as BullMQJob,
  JobsOptions as BullMQJobsOptions,
  JobType as BullMQJobType,
};

export class BullMQ {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _queuesMap: Map<string, Queue<any, any, any>> = new Map();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _workersMap: Map<string, Worker<any, any, any>> = new Map();

  private _redisClient?: RedisIORedis;

  constructor(private _redis: Redis) {}

  async getQueue<DataType, ResultType, NameType extends string>(name: string, opts?: QueueOptions) {
    if (!this._queuesMap.has(name)) {
      const queue = new Queue(name, {
        connection: this.getClient(),
        ...opts,
      });

      this._queuesMap.set(name, queue);
    }

    return this._queuesMap.get(name) as Queue<DataType, ResultType, NameType>;
  }

  async getWorker<DataType, ResultType, NameType extends string>(
    name: string,
    processor?: string | null | Processor<DataType, ResultType, NameType>,
    opts?: Omit<WorkerOptions, 'connection'>
  ) {
    if (!this._workersMap.has(name)) {
      const worker = new Worker(name, processor, {
        connection: this.getClient(),
        ...opts,
      });

      this._workersMap.set(name, worker);
    }

    return this._workersMap.get(name) as Worker<DataType, ResultType, NameType>;
  }

  getClient() {
    if (!this._redisClient) {
      this._redisClient = this._redis.createClient({
        maxRetriesPerRequest: null,
      });
    }

    return this._redisClient;
  }
}

export const bullMQ = new BullMQ(redis);
