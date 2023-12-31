import { logger, Logger } from '@moaitime/logging';
import { ProcessingStatusEnum } from '@moaitime/shared-common';

import { userDataExportsManager, UserDataExportsManager } from './UserDataExportsManager';

export class UserDataExportProcessor {
  constructor(
    private _logger: Logger,
    private _userDataExportsManager: UserDataExportsManager
  ) {}

  async processNextPending() {
    // TODO: implement retry mechanism in case of failure

    this._logger.info('Processing next pending data export ...');

    const userDataExport = await this._userDataExportsManager.findOneOldestPending();
    if (!userDataExport) {
      this._logger.debug('No pending data exports found.');

      return;
    }

    try {
      this._logger.info(
        `Found pending data export (id: ${userDataExport.userId}). Starting to process ...`
      );

      await this._userDataExportsManager.updateOneById(userDataExport.id, {
        processingStatus: ProcessingStatusEnum.PROCESSING,
        startedAt: new Date(),
      });

      // TODO

      await this._userDataExportsManager.updateOneById(userDataExport.id, {
        processingStatus: ProcessingStatusEnum.PROCESSED,
        completedAt: new Date(),
      });

      this._logger.info(`Finished processing data export (id: ${userDataExport.userId})`);
    } catch (error) {
      this._logger.error(
        error,
        `Failed to process data export (id: ${userDataExport.userId}). Starting to process ...`
      );

      await this._userDataExportsManager.updateOneById(userDataExport.id, {
        processingStatus: ProcessingStatusEnum.FAILED,
        failedAt: new Date(),
        failedError: JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error))),
      });
    }
  }

  setLogger(logger: Logger) {
    this._logger = logger;
  }
}

export const userDataExportProcessor = new UserDataExportProcessor(logger, userDataExportsManager);
