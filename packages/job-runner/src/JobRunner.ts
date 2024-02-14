import {
  userDataExportProcessor,
  UserDataExportProcessor,
  userDeletionProcessor,
  UserDeletionProcessor,
} from '@moaitime/database-services';
import { GlobalEventsProcessor, globalEventsProcessor } from '@moaitime/global-events-processor';
import { logger, Logger } from '@moaitime/logging';
import { shutdownManager, ShutdownManager } from '@moaitime/processes';
import { SharedQueueWorkerJobEnum } from '@moaitime/shared-backend';
import { sleep } from '@moaitime/shared-common';
import { sharedQueueWorker, SharedQueueWorker } from '@moaitime/shared-queue-worker';

export class JobRunner {
  private _globalEventsProcessorSubscription?: () => Promise<void>;

  constructor(
    private _logger: Logger,
    private _shutdownManager: ShutdownManager,
    private _sharedQueueWorker: SharedQueueWorker,
    private _globalEventsProcessor: GlobalEventsProcessor,
    private _userDeletionManager: UserDeletionProcessor,
    private _userDataExportsManager: UserDataExportProcessor
  ) {}

  async start() {
    this._logger.info('[JobRunner] Starting job runner ...');

    this._shutdownManager.registerTask('JobRunner:Shutdown', this.terminate.bind(this));

    await this._registerSharedQueueJobs();
    await this._registerGlobalEventNoifications();

    return new Promise(() => {
      // Together forever and never apart ...
    });
  }

  async terminate() {
    this._logger.info(`[JobRunner] Terminating ...`);

    await this._sharedQueueWorker.terminate();
    await this._globalEventsProcessorSubscription?.();

    await sleep(2000); // Just in case
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

  private async _registerGlobalEventNoifications() {
    this._logger.debug(`[JobRunner] Registering global event notifications ...`);

    this._globalEventsProcessorSubscription = await this._globalEventsProcessor.start();
  }
}

export const jobRunner = new JobRunner(
  logger,
  shutdownManager,
  sharedQueueWorker,
  globalEventsProcessor,
  userDeletionProcessor,
  userDataExportProcessor
);
