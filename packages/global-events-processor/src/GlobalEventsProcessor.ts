import { GlobalEventsNotifier, globalEventsNotifier } from '@moaitime/global-events-notifier';
import { Logger, logger } from '@moaitime/logging';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';
import { userExpereincePointsProcessor } from '@moaitime/user-experience-points-processor';

export class GlobalEventsProcessor {
  constructor(
    private _logger: Logger,
    private _globalEventsNotifier: GlobalEventsNotifier
  ) {}

  async start() {
    return this._globalEventsNotifier.subscribeToQueue('*', async (message) => {
      this._logger.debug(
        `[GlobalEventsProcessor] Received global event "${message.type}" with payload: ${JSON.stringify(
          message.payload
        )} ...`
      );

      try {
        await this._processEvent(message.type, message.payload);
      } catch (error) {
        this._logger.error(
          error,
          `[GlobalEventsProcessor] Error processing global event "${message.type}" with payload: ${JSON.stringify(
            message.payload
          )} ...`
        );
      }
    });
  }

  private async _processEvent<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    /********** User Experience Points **********/
    userExpereincePointsProcessor.process(type, payload);

    /********** User Achievements **********/
    // TODO
  }
}

export const globalEventsProcessor = new GlobalEventsProcessor(logger, globalEventsNotifier);
