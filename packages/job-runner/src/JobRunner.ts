import {
  userDataExportProcessor,
  UserDataExportProcessor,
  userDeletionProcessor,
  UserDeletionProcessor,
} from '@moaitime/database-services';
import { logger, Logger } from '@moaitime/logging';
import { shutdownManager, ShutdownManager } from '@moaitime/processes';
import { redis, Redis } from '@moaitime/redis';
import { SharedQueueWorkerJobEnum, sleep } from '@moaitime/shared-common';
import { sharedQueueWorker, SharedQueueWorker } from '@moaitime/shared-queue-worker';

export class JobRunner {
  constructor(
    private _logger: Logger,
    private _shutdownManager: ShutdownManager,
    private _redis: Redis,
    private _sharedQueueWorker: SharedQueueWorker,
    private _userDeletionManager: UserDeletionProcessor,
    private _userDataExportsManager: UserDataExportProcessor
  ) {}

  async start() {
    this._logger.info('Starting job runner ...');

    this._shutdownManager.registerTask('JobRunner:Shutdown', this.terminate.bind(this));

    await this._registerSharedQueueJobs();

    return new Promise(() => {
      // Together forever and never apart ...
    });
  }

  async terminate() {
    this._logger.info(`[JobRunner] Terminating ...`);

    await this._sharedQueueWorker.terminate();
    await this._redis.terminate();

    await sleep(5000); // Just in case
  }

  private async _registerSharedQueueJobs() {
    this._logger.debug(`[JobRunner] Registering shared queue jobs ...`);

    this._sharedQueueWorker.setLogger(this._logger);

    // Users permanent delete
    this._userDeletionManager.setLogger(this._logger);

    this._sharedQueueWorker.addToQueue(
      SharedQueueWorkerJobEnum.USERS_PERMANENT_DELETE,
      {},
      async () => {
        this._logger.info(
          `[JobRunner] Running job "${SharedQueueWorkerJobEnum.USERS_PERMANENT_DELETE}" ...`
        );

        await this._userDeletionManager.processOverdueForDeletion();
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        repeat: {
          pattern: '0 * * * *', // Every hour
        },
      }
    );

    // Users data export
    this._userDataExportsManager.setLogger(this._logger);

    this._sharedQueueWorker.addToQueue(
      SharedQueueWorkerJobEnum.USERS_DATA_EXPORT,
      {},
      async () => {
        this._logger.info(
          `[JobRunner] Running job "${SharedQueueWorkerJobEnum.USERS_DATA_EXPORT}" ...`
        );

        await this._userDataExportsManager.processNextPending();
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
        repeat: {
          pattern: '* * * * *', // Every minute
        },
      }
    );

    await this._sharedQueueWorker.initializeAndRunWorker();
  }
}

export const jobRunner = new JobRunner(
  logger,
  shutdownManager,
  redis,
  sharedQueueWorker,
  userDeletionProcessor,
  userDataExportProcessor
);
