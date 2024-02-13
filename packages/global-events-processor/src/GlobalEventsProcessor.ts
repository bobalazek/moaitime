import {
  GlobalEventsNotifier,
  globalEventsNotifier,
  GlobalEventsNotifierQueueEnum,
} from '@moaitime/global-events-notifier';
import { Logger, logger } from '@moaitime/logging';

export class GlobalEventsProcessor {
  constructor(
    private _logger: Logger,
    private _globalEventsNotifier: GlobalEventsNotifier
  ) {}

  async start() {
    return this._globalEventsNotifier.subscribe(
      GlobalEventsNotifierQueueEnum.JOB_RUNNER,
      '*',
      async (message) => {
        this._logger.debug(
          `[GlobalEventsProcessor] Received global event "${message.type}" with payload: ${JSON.stringify(
            message.payload
          )} ...`
        );

        // TODO: actually process the event
      }
    );
  }
}

export const globalEventsProcessor = new GlobalEventsProcessor(logger, globalEventsNotifier);
