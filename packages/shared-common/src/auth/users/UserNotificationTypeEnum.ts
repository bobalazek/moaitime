import { EntityTypeEnum } from '../../core/entities/EntityTypeEnum';

export enum UserNotificationTypeEnum {
  USER_FOLLOW_REQUEST_RECEIVED = 'user-follow-request-received',
  USER_FOLLOW_REQUEST_APPROVED = 'user-follow-request-approved',
  USER_ASSIGNED_TO_TASK = 'user-assigned-to-task',
  USER_ACHIEVEMENT_RECEIVED = 'user-achievement-received',
}

export const UserNotificationTypeMessages: Record<UserNotificationTypeEnum, string> = {
  [UserNotificationTypeEnum.USER_FOLLOW_REQUEST_RECEIVED]: `**{{requestingUser.displayName}}** has sent you a follow request.`,
  [UserNotificationTypeEnum.USER_FOLLOW_REQUEST_APPROVED]: `**{{approvingUser.displayName}}** has approved your request.`,
  [UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK]: `**{{assigningUser.displayName}}** has assigned you to the "{{task.name}}" task.`,
  [UserNotificationTypeEnum.USER_ACHIEVEMENT_RECEIVED]: `Congratulations! You have received the achievement "{{achievement.name}}", level {{achievementLevel}}.`,
};

export type UserNotificationTypeVariables = {
  [UserNotificationTypeEnum.USER_FOLLOW_REQUEST_RECEIVED]: {
    requestingUser: {
      id: string;
      displayName: string;
      __entityType: EntityTypeEnum.USER;
    };
  };
  [UserNotificationTypeEnum.USER_FOLLOW_REQUEST_APPROVED]: {
    approvingUser: {
      id: string;
      displayName: string;
      __entityType: EntityTypeEnum.USER;
    };
  };
  [UserNotificationTypeEnum.USER_ASSIGNED_TO_TASK]: {
    assigningUser: {
      id: string;
      displayName: string;
      __entityType: EntityTypeEnum.USER;
    };
    task: {
      id: string;
      name: string;
      __entityType: EntityTypeEnum.TASK;
    };
  };
  [UserNotificationTypeEnum.USER_ACHIEVEMENT_RECEIVED]: {
    achievement: {
      id: string;
      name: string;
      __entityType: EntityTypeEnum.ACHIEVEMENT;
    };
    achievementLevel: number;
  };
};
