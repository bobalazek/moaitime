import {
  tasksManager,
  userAchievementsManager,
  userNotificationsSender,
  usersManager,
} from '@moaitime/database-services';
import {
  AchievementEnum,
  EntityTypeEnum,
  GlobalEvents,
  GlobalEventsEnum,
} from '@moaitime/shared-common';

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
      const key = `${EntityTypeEnum.USERS}:${data.userId}`;
      const achievementKey = AchievementEnum.USER_AVATAR_SET;

      await userAchievementsManager.addOrUpdateAchievementForUser(
        data.userId,
        achievementKey,
        1,
        key,
        {
          id: data.userId,
          type: EntityTypeEnum.USERS,
        }
      );

      await userNotificationsSender.sendUserAchievementReceivedNotification(
        data.actorUserId,
        achievementKey,
        1
      );
    } else if (!hasProfilePicture && achievement) {
      await userAchievementsManager.removeAchievement(data.userId, achievement.id);
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

    const now = new Date();
    const key = `${EntityTypeEnum.TASKS}:${task.id}:${now.toISOString().split('T')[0]}`;

    const { userAchievementPreviousLevel, userAchievementNewLevel } =
      await userAchievementsManager.addOrUpdateAchievementForUser(
        data.actorUserId,
        achievementKey,
        1,
        key,
        {
          id: task.id,
          type: EntityTypeEnum.TASKS,
        }
      );

    if (userAchievementPreviousLevel === userAchievementNewLevel) {
      return;
    }

    await userNotificationsSender.sendUserAchievementReceivedNotification(
      data.actorUserId,
      achievementKey,
      userAchievementNewLevel
    );
  }
}

export const userAchievementsProcessor = new UserAchievementsProcessor();
