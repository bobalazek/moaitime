import {
  userExperiencePointsManager,
  UserExperiencePointsManager,
} from '@moaitime/database-services';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

import { userExperiencePointsByEvent } from './UserExperiencePointsByEvent';

export class UserExperiencePointsProcessor {
  constructor(private _userExperiencePointsManager: UserExperiencePointsManager) {}

  async process<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    const finalType = type as keyof typeof userExperiencePointsByEvent;
    if (userExperiencePointsByEvent[finalType]) {
      const data = payload as GlobalEvents[T];
      const amount = userExperiencePointsByEvent[finalType].amount;

      // Really not in the mood dealing with TypeScript right now
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const relatedEntities = userExperiencePointsByEvent[finalType].relatedEntities(data as any);

      await this._userExperiencePointsManager.addExperiencePointsToUser(
        data.actorUserId,
        `global-event:${type}`,
        amount,
        relatedEntities
      );
    }
  }
}

export const userExperiencePointsProcessor = new UserExperiencePointsProcessor(
  userExperiencePointsManager
);
