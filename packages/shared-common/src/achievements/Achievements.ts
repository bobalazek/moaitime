import { AchievementType } from './AchievementType';

export enum AchievementEnum {
  USER_AVATAR_SET = 'user-avatar-set',
  USER_TASKS_ADDED = 'user-tasks-added',
  USER_TASKS_COMPLETED = 'user-tasks-completed',
}

export const Achievements: AchievementType[] = [
  {
    key: AchievementEnum.USER_AVATAR_SET,
    name: 'Face Forward',
    description: 'Showed us your dazzling smile (or cool avatar)!',
    levelPoints: [1],
  },
  {
    key: AchievementEnum.USER_TASKS_ADDED,
    name: 'Task Master',
    description: 'Keep up the good working adding tasks',
    levelPoints: [1],
  },
  {
    key: AchievementEnum.USER_TASKS_COMPLETED,
    name: 'Task Slayer',
    description: 'Slaying those tasks like a boss!',
    levelPoints: [1],
  },
];
