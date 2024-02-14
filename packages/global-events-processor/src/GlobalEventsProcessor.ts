import {
  UserExperiencePointsManager,
  userExperiencePointsManager,
} from '@moaitime/database-services';
import { GlobalEventsNotifier, globalEventsNotifier } from '@moaitime/global-events-notifier';
import { Logger, logger } from '@moaitime/logging';
import {
  GlobalEvents,
  GlobalEventsEnum,
  userExperiencePointsByEvent,
} from '@moaitime/shared-common';

export class GlobalEventsProcessor {
  constructor(
    private _logger: Logger,
    private _globalEventsNotifier: GlobalEventsNotifier,
    private _userExperiencePointsManager: UserExperiencePointsManager
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
    const finalType = type as keyof typeof userExperiencePointsByEvent;
    if (userExperiencePointsByEvent[finalType]) {
      const data = payload as GlobalEvents[T];
      const amount = userExperiencePointsByEvent[finalType].amount;

      // Really not in the mood dealing with TypeScript right now
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relatedEntities = userExperiencePointsByEvent[finalType].relatedEntities(data as any);

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        amount,
        relatedEntities
      );
    }

    /********** User Achievements **********/
    // TODO
  }
}

export const globalEventsProcessor = new GlobalEventsProcessor(
  logger,
  globalEventsNotifier,
  userExperiencePointsManager
);
