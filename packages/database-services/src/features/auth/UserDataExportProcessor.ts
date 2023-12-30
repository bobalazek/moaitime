import { logger, Logger } from '@moaitime/logging';

export class UserDataExportProcessor {
  constructor(private _logger: Logger) {}

  async processNextPending() {
    this._logger.info('Processing next pending data export ...');

    // TODO
  }

  setLogger(logger: Logger) {
    this._logger = logger;
  }
}

export const userDataExportProcessor = new UserDataExportProcessor(logger);
