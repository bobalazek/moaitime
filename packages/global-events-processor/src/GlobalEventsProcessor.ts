import {
  UserExperiencePointsManager,
  userExperiencePointsManager,
} from '@moaitime/database-services';
import {
  GlobalEventsNotifier,
  globalEventsNotifier,
  GlobalEventsNotifierQueueEnum,
} from '@moaitime/global-events-notifier';
import { Logger, logger } from '@moaitime/logging';
import { EntityTypeEnum, GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export class GlobalEventsProcessor {
  constructor(
    private _logger: Logger,
    private _globalEventsNotifier: GlobalEventsNotifier,
    private _userExperiencePointsManager: UserExperiencePointsManager
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
      }
    );
  }

  private async _processEvent<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    /********** User Experience Points **********/
    // Tasks
    if (type === GlobalEventsEnum.TASKS_TASK_ADDED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED];

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        5,
        [`${EntityTypeEnum.TASKS}:${data.taskId}`]
      );
    } else if (type === GlobalEventsEnum.TASKS_TASK_COMPLETED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.TASKS_TASK_COMPLETED];

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        20,
        [`${EntityTypeEnum.TASKS}:${data.taskId}`]
      );

      // Events
    } else if (type === GlobalEventsEnum.CALENDAR_EVENT_ADDED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.CALENDAR_EVENT_ADDED];

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        5,
        [`${EntityTypeEnum.EVENTS}:${data.eventId}`]
      );

      // Mood
    } else if (type === GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED];

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        5,
        [`${EntityTypeEnum.MOOD_ENTRIES}:${data.moodEntryId}`]
      );

      // Focus sessions
    } else if (type === GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED];

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        5,
        [`${EntityTypeEnum.FOCUS_SESSIONS}:${data.focusSessionId}`]
      );
    } else if (type === GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED];

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.userId,
        `global-event:${type}`,
        20,
        [`${EntityTypeEnum.FOCUS_SESSIONS}:${data.focusSessionId}`]
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
