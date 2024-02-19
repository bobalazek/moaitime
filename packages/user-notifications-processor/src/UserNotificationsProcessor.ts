import { tasksManager, userNotificationsSender, usersManager } from '@moaitime/database-services';
import { GlobalEvents, GlobalEventsEnum } from '@moaitime/shared-common';

export class UserNotificationsProcessor {
  async process<T extends GlobalEventsEnum>(type: T, payload: GlobalEvents[T]) {
    if (type === GlobalEventsEnum.AUTH_USER_FOLLOWED_USER) {
      await this._processAuthUserFollowedUserEvent(
        payload as GlobalEvents[GlobalEventsEnum.AUTH_USER_FOLLOWED_USER]
      );
    } else if (type === GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER) {
      await this._processTasksTaskAssignedToUserEvent(
        payload as GlobalEvents[GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER]
      );
    }
  }

  // Private
  private async _processAuthUserFollowedUserEvent(
    data: GlobalEvents[GlobalEventsEnum.AUTH_USER_FOLLOWED_USER]
  ) {
    if (!data.needsApproval) {
      return;
    }

    const user = await usersManager.findOneById(data.actorUserId);
    if (!user) {
      throw new Error(`User with id "${data.actorUserId}" not found`);
    }

    const userFollowedUser = await usersManager.getUserFollowedUserById(data.userFollowedUserId);
    if (!userFollowedUser) {
      throw new Error(`User followed user with id "${data.userFollowedUserId}" not found`);
    }

    await userNotificationsSender.sendUserFollowRequestNotification(
      userFollowedUser.followedUserId,
      user
    );
  }

  private async _processTasksTaskAssignedToUserEvent(
    data: GlobalEvents[GlobalEventsEnum.TASKS_TASK_ASSIGNED_TO_USER]
  ) {
    const user = await usersManager.findOneById(data.actorUserId);
    if (!user) {
      throw new Error(`User with id "${data.actorUserId}" not found`);
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
