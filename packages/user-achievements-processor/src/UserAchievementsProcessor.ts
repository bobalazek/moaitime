import {
  moodEntriesManager,
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
    switch (type) {
      case GlobalEventsEnum.AUTH_USER_UPDATED:
        return this._processAuthUserUpdatedEvent(
          payload as GlobalEvents[GlobalEventsEnum.AUTH_USER_UPDATED]
        );
      case GlobalEventsEnum.AUTH_USER_FOLLOWED_USER:
      case GlobalEventsEnum.AUTH_USER_UNFOLLOWED_USER:
      case GlobalEventsEnum.AUTH_USER_APPROVE_FOLLOWED_USER:
      case GlobalEventsEnum.AUTH_USER_REMOVE_FOLLOWED_USER:
        return this._processAuthUserFollowedEvent(
          payload as
            | GlobalEvents[GlobalEventsEnum.AUTH_USER_FOLLOWED_USER]
            | GlobalEvents[GlobalEventsEnum.AUTH_USER_UNFOLLOWED_USER]
            | GlobalEvents[GlobalEventsEnum.AUTH_USER_APPROVE_FOLLOWED_USER]
            | GlobalEvents[GlobalEventsEnum.AUTH_USER_REMOVE_FOLLOWED_USER]
        );
      case GlobalEventsEnum.TASKS_TASK_ADDED:
      case GlobalEventsEnum.TASKS_TASK_COMPLETED:
        return this._processTasksTaskAddedOrCompletedEvent(
          payload as
            | GlobalEvents[GlobalEventsEnum.TASKS_TASK_ADDED]
            | GlobalEvents[GlobalEventsEnum.TASKS_TASK_COMPLETED],
          type === GlobalEventsEnum.TASKS_TASK_ADDED
            ? AchievementEnum.USER_TASKS_ADDED
            : AchievementEnum.USER_TASKS_COMPLETED
        );
      case GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED:
        return this._processMoodMoodEntryAddedEvent(
          payload as GlobalEvents[GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]
        );
      case GlobalEventsEnum.HABITS_HABIT_ADDED:
        return this._processHabitsHabitAddedEvent(
          payload as GlobalEvents[GlobalEventsEnum.HABITS_HABIT_ADDED]
        );
    }
  }

  // Private
  async _addAndNotifyAchievement(
    userId: string,
    achievementKey: AchievementEnum,
    points: number,
    pointsAction: 'add' | 'set',
    key: string,
    data?: Record<string, unknown>
  ) {
    const { userAchievementPreviousLevel, userAchievementNewLevel } =
      await userAchievementsManager.addOrUpdateAchievementForUser(
        userId,
        achievementKey,
        points,
        pointsAction,
        key,
        data
      );

    if (userAchievementNewLevel > userAchievementPreviousLevel) {
      await userNotificationsSender.sendUserAchievementReceivedNotification(
        userId,
        achievementKey,
        userAchievementNewLevel
      );
    }
  }

  // Auth
  private async _processAuthUserUpdatedEvent(
    data: GlobalEvents[GlobalEventsEnum.AUTH_USER_UPDATED]
  ) {
    const user = await usersManager.findOneById(data.userId);
    if (!user) {
      throw new Error(`User with id "${data.userId}" not found`);
    }

    const achievementKey = AchievementEnum.USER_AVATAR_SET;
    const points = user.avatarImageUrl ? 1 : 0;
    const key = `${EntityTypeEnum.USERS}:${data.userId}`;

    await this._addAndNotifyAchievement(data.userId, achievementKey, points, 'set', key, {
      id: data.userId,
      type: EntityTypeEnum.USERS,
    });
  }

  private async _processAuthUserFollowedEvent(
    data: GlobalEvents[
      | GlobalEventsEnum.AUTH_USER_FOLLOWED_USER
      | GlobalEventsEnum.AUTH_USER_UNFOLLOWED_USER
      | GlobalEventsEnum.AUTH_USER_APPROVE_FOLLOWED_USER
      | GlobalEventsEnum.AUTH_USER_REMOVE_FOLLOWED_USER]
  ) {
    const user = await usersManager.findOneById(data.actorUserId);
    if (!user) {
      throw new Error(`User with id "${data.actorUserId}" not found`);
    }

    const followingCount = await usersManager.countFollowing(data.actorUserId);

    const achievementKey = AchievementEnum.USER_FOLLOWED_USERS;
    const key = `${EntityTypeEnum.USERS}:${data.userFollowedUserId}`;

    await this._addAndNotifyAchievement(
      data.actorUserId,
      achievementKey,
      followingCount,
      'set',
      key,
      {
        id: data.userFollowedUserId,
        type: EntityTypeEnum.USERS,
      }
    );
  }

  // Tasks
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

    await this._addAndNotifyAchievement(data.actorUserId, achievementKey, 1, 'add', key, {
      id: task.id,
      type: EntityTypeEnum.TASKS,
    });
  }

  // Mood
  private async _processMoodMoodEntryAddedEvent(
    data: GlobalEvents[GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED]
  ) {
    const user = await usersManager.findOneById(data.actorUserId);
    if (!user) {
      throw new Error(`User with id "${data.actorUserId}" not found`);
    }

    const moodEntry = await moodEntriesManager.findOneById(data.moodEntryId);
    if (!moodEntry) {
      throw new Error(`Mood entry with id "${data.moodEntryId}" not found`);
    }

    const now = new Date();
    const key = `${EntityTypeEnum.MOOD_ENTRIES}:${moodEntry.id}:${now.toISOString().split('T')[0]}`;

    await this._addAndNotifyAchievement(
      data.actorUserId,
      AchievementEnum.USER_MOOD_ENTRIES_ADDED,
      1,
      'add',
      key,
      {
        id: moodEntry.id,
        type: EntityTypeEnum.MOOD_ENTRIES,
      }
    );
  }

  // Habits
  private async _processHabitsHabitAddedEvent(
    data: GlobalEvents[GlobalEventsEnum.HABITS_HABIT_ADDED]
  ) {
    const user = await usersManager.findOneById(data.actorUserId);
    if (!user) {
      throw new Error(`User with id "${data.actorUserId}" not found`);
    }

    const now = new Date();
    const key = `${EntityTypeEnum.HABITS}:${data.habitId}:${now.toISOString().split('T')[0]}`;

    await this._addAndNotifyAchievement(
      data.actorUserId,
      AchievementEnum.USER_HABITS_ADDED,
      1,
      'add',
      key,
      {
        id: data.habitId,
        type: EntityTypeEnum.HABITS,
      }
    );
  }
}

export const userAchievementsProcessor = new UserAchievementsProcessor();
