import { GlobalEventsNotifier, globalEventsNotifier } from '@moaitime/global-events-notifier';
import { Logger, logger } from '@moaitime/logging';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';
import { userAchievementsProcessor } from '@moaitime/user-achievements-processor';
import { userExperiencePointsProcessor } from '@moaitime/user-experience-points-processor';
import { userNotificationsProcessor } from '@moaitime/user-notifications-processor';

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
    try {
      await userExperiencePointsProcessor.process(type, payload);
    } catch (error) {
      this._logger.error(
        error,
        `[GlobalEventsProcessor] Error processing global event "${type}" with user experience points processor ...`
      );
    }

    try {
      await userAchievementsProcessor.process(type, payload);
    } catch (error) {
      this._logger.error(
        error,
        `[GlobalEventsProcessor] Error processing global event "${type}" with user achievements processor ...`
      );
    }

    try {
      await userNotificationsProcessor.process(type, payload);
    } catch (error) {
      this._logger.error(
        error,
        `[GlobalEventsProcessor] Error processing global event "${type}" with user notifications processor ...`
      );
    }
  }
}

export const globalEventsProcessor = new GlobalEventsProcessor(logger, globalEventsNotifier);
