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

export const userExpereincePointsMap = {
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED]) => {
      return [`${EntityTypeEnum.TASKS}:${payload.taskId}`];
    },
  },
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: {
    amount: 10,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.TASKS_TASK_COMPLETED]) => {
      return [`${EntityTypeEnum.TASKS}:${payload.taskId}`];
    },
  },
  [GlobalEventsEnum.CALENDAR_EVENT_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.CALENDAR_EVENT_ADDED]) => {
      return [`${EntityTypeEnum.EVENTS}:${payload.eventId}`];
    },
  },
  [GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]) => {
      return [`${EntityTypeEnum.MOOD_ENTRIES}:${payload.moodEntryId}`];
    },
  },
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]: {
    amount: 5,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED]) => {
      return [`${EntityTypeEnum.FOCUS_SESSIONS}:${payload.focusSessionId}`];
    },
  },
  [GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]: {
    amount: 10,
    relatedEntities: (payload: GlobalEvents[GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED]) => {
      return [`${EntityTypeEnum.FOCUS_SESSIONS}:${payload.focusSessionId}`];
    },
  },
};

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
    const finalType = type as keyof typeof userExpereincePointsMap;
    if (userExpereincePointsMap[finalType]) {
      const data = payload as GlobalEvents[T];
      const amount = userExpereincePointsMap[finalType].amount;

      // Really not in the mood dealing with TypeScript right now
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relatedEntities = userExpereincePointsMap[finalType].relatedEntities(data as any);

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
