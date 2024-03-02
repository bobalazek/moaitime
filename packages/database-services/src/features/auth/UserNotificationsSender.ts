import { Task, User, UserNotification } from '@moaitime/database-core';
import {
  AchievementEnum,
  AchievementsMap,
  EntityTypeEnum,
  UserNotificationTypeEnum,
  UserNotificationTypeVariables,
} from '@moaitime/shared-common';

import { UserNotificationsManager, userNotificationsManager } from './UserNotificationsManager';

export class UserNotificationsSender {
  constructor(private _userNotificationsManager: UserNotificationsManager) {}

  async sendUserFollowRequestReceivedNotification(
    userId: string,
    requestingUser: User
  ): Promise<UserNotification> {
    const variables: UserNotificationTypeVariables[UserNotificationTypeEnum.USER_FOLLOW_REQUEST_RECEIVED] =
      {
        requestingUser: {
          id: requestingUser.id,
          displayName: requestingUser.displayName,
          __entityType: EntityTypeEnum.USERS,
        },
      };
    const relatedEntities = this._getRelatedEntitiesFromVariables(variables);
    const targetEntity = {
      id: requestingUser.id,
      type: EntityTypeEnum.USERS,
    };

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_FOLLOW_REQUEST_RECEIVED,
      userId,
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
    const variables: UserNotificationTypeVariables[UserNotificationTypeEnum.USER_FOLLOW_REQUEST_APPROVED] =
      {
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
    const variables: UserNotificationTypeVariables[UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK] =
      {
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
      data: {
        variables,
      },
      targetEntity,
      relatedEntities,
    });
  }

  async sendUserAchievementReceivedNotification(
    userId: string,
    achievementKey: AchievementEnum,
    achievementLevel: number
  ): Promise<UserNotification> {
    const achievement = AchievementsMap.get(achievementKey);
    if (!achievement) {
      throw new Error(`Achievement with key "${achievementKey}" not found`);
    }

    const variables: UserNotificationTypeVariables[UserNotificationTypeEnum.USER_ACHIEVEMENT_RECEIVED] =
      {
        achievement: {
          id: achievement.key,
          name: achievement.name,
          __entityType: EntityTypeEnum.ACHIEVEMENTS,
        },
        achievementLevel,
      };
    const relatedEntities = this._getRelatedEntitiesFromVariables(variables);
    const targetEntity = {
      id: userId,
      type: EntityTypeEnum.USERS,
    };

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_ACHIEVEMENT_RECEIVED,
      userId,
      data: {
        variables,
      },
      targetEntity,
      relatedEntities,
    });
  }

  // Private
  private _getRelatedEntitiesFromVariables(variables: Record<string, unknown>) {
    const result: { id: string; type: EntityTypeEnum }[] = [];
    for (const key in variables) {
      const variable = variables[key];
      if (
        !variable ||
        typeof variable !== 'object' ||
        typeof (variable as { id: string }).id !== 'string' ||
        typeof (variable as { __entityType: EntityTypeEnum }).__entityType !== 'string'
      ) {
        continue;
      }

      result.push({
        id: (variable as { id: string }).id,
        type: (variable as { __entityType: EntityTypeEnum }).__entityType,
      });
    }

    return result;
  }
}

export const userNotificationsSender = new UserNotificationsSender(userNotificationsManager);
