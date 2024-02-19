import { tasksManager, userAchievementsManager, usersManager } from '@moaitime/database-services';
import { AchievementEnum, GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export class UserAchievementsProcessor {
  async process<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    if (type === GlobalEventsEnum.AUTH_USER_UPDATED) {
      await this._processAuthUserUpdatedEvent(
        payload as GlobalEvents[GlobalEventsEnum.AUTH_USER_UPDATED]
      );
    } else if (
      type === GlobalEventsEnum.TASKS_TASK_ADDED ||
      type === GlobalEventsEnum.TASKS_TASK_COMPLETED
    ) {
      await this._processTasksTaskAddedOrCompletedEvent(
        payload as
          | GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED]
          | GlobalEvents[GlobalEventsEnum.TASKS_TASK_COMPLETED],
        type === GlobalEventsEnum.TASKS_TASK_ADDED
          ? AchievementEnum.USER_TASKS_ADDED
          : AchievementEnum.USER_TASKS_COMPLETED
      );
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
      AchievementEnum.USER_AVATAR_SET
    );

    if (hasProfilePicture && !achievement) {
      await userAchievementsManager.addAchievementToUser(
        data.userId,
        AchievementEnum.USER_AVATAR_SET,
        1
      );
    } else if (!hasProfilePicture && achievement) {
      await userAchievementsManager.removeAchievement(achievement.id);
    }
  }

  private async _processTasksTaskAddedOrCompletedEvent(
    data: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED],
    achievementKey: AchievementEnum.USER_TASKS_ADDED | AchievementEnum.USER_TASKS_COMPLETED
  ) {
    const user = await usersManager.findOneById(data.actorUserId);
    if (!user) {
      throw new Error(`User with id "${data.actorUserId}" not found`);
    }

    const task = await tasksManager.findOneById(data.taskId);
    if (!task) {
      throw new Error(`Task with id "${data.taskId}" not found`);
    }

    // TODO: perhaps we should only awatd an achievement once per day, even if the repeat is daily,
    // to avoid spamming the user with achievements.

    const achievement = await userAchievementsManager.findOneByUserIdAndAchievementKey(
      data.actorUserId,
      achievementKey
    );

    if (!achievement) {
      await userAchievementsManager.addAchievementToUser(data.actorUserId, achievementKey, 1);
    } else {
      const currentPoints = achievement.points;

      await userAchievementsManager.updateAchievement(achievement.id, currentPoints + 1);
    }
  }
}

export const userAchievementsProcessor = new UserAchievementsProcessor();
