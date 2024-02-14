import { userAchievementsManager, usersManager } from '@moaitime/database-services';
import { AchievementEnum, GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export class UserAchievementsProcessor {
  async process<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    if (type === GlobalEventsEnum.AUTH_USER_UPDATED) {
      const data = payload as GlobalEvents[GlobalEventsEnum.AUTH_USER_UPDATED];

      await this._processAuthUserUpdatedEvent(data);
    }
  }

  // Private
  private async _processAuthUserUpdatedEvent(
    data: GlobalEvents[GlobalEventsEnum.AUTH_USER_UPDATED]
  ) {
    const user = await usersManager.findOneById(data.userId);
    if (!user) {
      throw new Error(`User with id "${data.userId}" not found`);
    }

    const hasProfilePicture = !!user.avatarImageUrl;

    const achievement = await userAchievementsManager.findOneByUserIdAndAchievementKey(
      data.userId,
      AchievementEnum.FACE_FORWARD
    );

    if (hasProfilePicture && !achievement) {
      await userAchievementsManager.addAchievementToUser(
        data.userId,
        AchievementEnum.FACE_FORWARD,
        1
      );
    } else if (!hasProfilePicture && achievement) {
      await userAchievementsManager.removeAchievementFromUser(achievement.id);
    }
  }
}

export const userAchievementsProcessor = new UserAchievementsProcessor();
