import { tasksManager, userNotificationsSender, usersManager } from '@moaitime/database-services';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export class UserNotificationsProcessor {
  async process<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    if (type === GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER) {
      await this._processTasksTaskAssignedToUserEvent(
        payload as GlobalEvents[GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER]
      );
    }
  }

  // Private
  private async _processTasksTaskAssignedToUserEvent(
    data: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER]
  ) {
    const user = await usersManager.findOneById(data.userId);
    if (!user) {
      throw new Error(`User with id "${data.userId}" not found`);
    }

    // Do not send a notification to the setter
    if (data.targetUserId == user.id) {
      return;
    }

    const task = await tasksManager.findOneById(data.taskId);
    if (!task) {
      throw new Error(`Task with id "${data.taskId}" not found`);
    }

    await userNotificationsSender.sendAssignedUserToTaskNotification(data.targetUserId, user, task);
  }
}

export const userNotificationsProcessor = new UserNotificationsProcessor();
