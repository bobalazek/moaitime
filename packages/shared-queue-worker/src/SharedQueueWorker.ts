import {
  BullMQ,
  bullMQ,
  BullMQJob,
  BullMQJobsOptions,
  BullMQJobType,
  BullMQQueue,
  BullMQWorker,
} from '@moaitime/bullmq';
import { Logger, logger } from '@moaitime/logging';
import { QUEUE_WORKERS_SHARED_QUEUE_NAME } from '@moaitime/shared-backend';
import { getQueueTypes } from '@moaitime/shared-common';

export class SharedQueueWorker {
  private _queue?: BullMQQueue;
  private _worker?: BullMQWorker;

  private _jobsMap: Map<string, (job: BullMQJob) => Promise<unknown>> = new Map();

  constructor(
    private _logger: Logger,
    private _bullMQ: BullMQ
  ) {}

  async initializeAndRunWorker() {
    this._logger.info(`[SharedQueueWorker] Initializing ...`);

    const worker = await this.getWorker();
    worker.run(); // DO NOT PREFIX WITH AWAIT, because it will block the process!
  }

  async terminate() {
    this._logger.info(`[SharedQueueWorker] Terminating ...`);

    await this._queue?.close();
    await this._worker?.close();
  }

  async getQueue() {
    if (!this._queue) {
      this._queue = await this._bullMQ.getQueue(QUEUE_WORKERS_SHARED_QUEUE_NAME);
    }

    return this._queue as BullMQQueue;
  }

  async getWorker() {
    if (!this._worker) {
      this._worker = await this._bullMQ.getWorker(
        QUEUE_WORKERS_SHARED_QUEUE_NAME,
        async (job) => {
          const jobCallback = this._jobsMap.get(job.name);
          if (!jobCallback) {
            throw new Error(
              `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}][JobName:${job.name}] Job not found`
            );
          }

          return jobCallback(job);
        },
        {
          concurrency: 10,
          autorun: false,
        }
      );
      this._worker
        .on('error', (error) => {
          this._logger.error(
            error,
            `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}] Error (in getWorker()):`
          );
        })
        .on('failed', (job, error) => {
          this._logger.error(
            error,
            `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}][JobName:${
              job?.name ?? '--undefined--'
            }] Failed:`
          );
        })
        .on('stalled', (job) => {
          this._logger.warn(
            `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}][JobName:${job}] Stalled`
          );
        })
        .on('drained', () => {
          this._logger.info(
            `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}] Drained`
          );
        });
    }

    return this._worker as BullMQWorker;
  }

  async addToQueue(
    name: string,
    data: unknown,
    callback: (job: BullMQJob) => Promise<unknown>,
    opts?: BullMQJobsOptions
  ) {
    this._logger.info(
      `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}] Adding job "${name}" to the queue ...`
    );

    if (this._jobsMap.has(name)) {
      throw new Error(
        `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}] A job with name "${name}" already exists`
      );
    }

    const queue = await this.getQueue();
    await queue.add(name, data, {
      removeOnComplete: true,
      removeOnFail: true,
      ...opts,
    });

    this._jobsMap.set(name, callback);
  }

  async obliterateQueue() {
    this._logger.info(
      `[SharedQueueWorker][Queue:${QUEUE_WORKERS_SHARED_QUEUE_NAME}] Obliterating queue ...`
    );

    const queue = await this.getQueue();
    await queue.obliterate({ force: true });

    this._jobsMap.clear();
  }

  async getQueueJobsCount() {
    const queue = await this.getQueue();
    return queue.getJobCounts(...this.getQueueTypes());
  }

  getQueueTypes(): BullMQJobType[] {
    return getQueueTypes() as BullMQJobType[];
  }

  setLogger(logger: Logger) {
    this._logger = logger;
  }
}

export const sharedQueueWorker = new SharedQueueWorker(logger, bullMQ);
