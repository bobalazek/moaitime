import { Task, User, UserNotification } from '@moaitime/database-core';
import {
  AchievementEnum,
  AchievementsMap,
  EntityTypeEnum,
  UserNotificationTypeEnum,
} from '@moaitime/shared-common';

import { UserNotificationsManager, userNotificationsManager } from './UserNotificationsManager';

export class UserNotificationsSender {
  constructor(private _userNotificationsManager: UserNotificationsManager) {}

  async sendUserFollowRequestReceivedNotification(
    userId: string,
    followingUser: User
  ): Promise<UserNotification> {
    const variables = {
      followingUser: {
        id: followingUser.id,
        displayName: followingUser.displayName,
        __entityType: EntityTypeEnum.USERS,
      },
    };
    const relatedEntities = this._getRelatedEntitiesFromVariables(variables);
    const targetEntity = {
      id: followingUser.id,
      type: EntityTypeEnum.USERS,
    };

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_FOLLOW_REQUEST_RECEIVED,
      userId,
      content: `**{{followingUser.displayName}}** has requested to follow you.`,
      data: {
        variables,
      },
      targetEntity,
      relatedEntities,
    });
  }

  async sendUserFollowRequestApprovedNotification(
    userId: string,
    approvingUser: User
  ): Promise<UserNotification> {
    const variables = {
      approvingUser: {
        id: approvingUser.id,
        displayName: approvingUser.displayName,
        __entityType: EntityTypeEnum.USERS,
      },
    };
    const relatedEntities = this._getRelatedEntitiesFromVariables(variables);
    const targetEntity = {
      id: approvingUser.id,
      type: EntityTypeEnum.USERS,
    };

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_FOLLOW_REQUEST_APPROVED,
      userId,
      content: `**{{approvingUser.displayName}}** has approved your request.`,
      data: {
        variables,
      },
      targetEntity,
      relatedEntities,
    });
  }

  async sendUserAssignedToTaskNotification(
    userId: string,
    assigningUser: User,
    task: Task
  ): Promise<UserNotification> {
    const variables = {
      assigningUser: {
        id: assigningUser.id,
        displayName: assigningUser.displayName,
        __entityType: EntityTypeEnum.USERS,
      },
      task: {
        id: task.id,
        name: task.name,
        __entityType: EntityTypeEnum.TASKS,
      },
    };
    const relatedEntities = this._getRelatedEntitiesFromVariables(variables);
    const targetEntity = {
      id: task.id,
      type: EntityTypeEnum.TASKS,
    };

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK,
      userId,
      content: `**{{assigningUser.displayName}}** has assigned you to the "{{task.name}}" task.`,
      data: {
        variables,
      },
      targetEntity,
      relatedEntities,
    });
  }

  async sendUserAchievementReceivedNotification(
    userId: string,
    achievementKey: AchievementEnum
  ): Promise<UserNotification> {
    const achievement = AchievementsMap.get(achievementKey);
    if (!achievement) {
      throw new Error(`Achievement with key "${achievementKey}" not found`);
    }

    const variables = {
      achievement: {
        id: achievement.key,
        name: achievement.name,
        __entityType: EntityTypeEnum.ACHIEVEMENTS,
      },
    };
    const relatedEntities = this._getRelatedEntitiesFromVariables(variables);
    const targetEntity = {
      id: userId,
      type: EntityTypeEnum.USERS,
    };

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_ACHIEVEMENT_RECEIVED,
      userId,
      content: `You have received the achievement "{{achievement.name}}".`,
      data: {
        variables,
      },
      targetEntity,
      relatedEntities,
    });
  }

  // Private
  private _getRelatedEntitiesFromVariables(
    variables: Record<string, { id: string; __entityType: EntityTypeEnum }>
  ) {
    return Object.values(variables).map((v) => {
      return {
        id: v.id,
        type: v.__entityType,
      };
    });
  }
}

export const userNotificationsSender = new UserNotificationsSender(userNotificationsManager);
