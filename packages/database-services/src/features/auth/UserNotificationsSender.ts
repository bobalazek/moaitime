import { Task, User, UserNotification } from '@moaitime/database-core';
import { EntityTypeEnum, UserNotificationTypeEnum } from '@moaitime/shared-common';

import { UserNotificationsManager, userNotificationsManager } from './UserNotificationsManager';

export class UserNotificationsSender {
  constructor(private _userNotificationsManager: UserNotificationsManager) {}

  async sendAssignedUserToTaskNotification(
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
    const relatedEntities = Object.values(variables).map((v) => `${v.__entityType}:${v.id}`);
    const targetEntity = `${EntityTypeEnum.TASKS}:${task.id}`;

    return this._userNotificationsManager.addNotification({
      type: UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK,
      userId,
      content: `**{{assigningUser.displayName}}** has assigned you to the "{{task.name}}" task.`,
      data: {
        variables: variables,
      },
      targetEntity,
      relatedEntities,
    });
  }
}

export const userNotificationsSender = new UserNotificationsSender(userNotificationsManager);
