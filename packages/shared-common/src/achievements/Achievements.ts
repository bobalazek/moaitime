import { AchievementEnum } from './AchievementEnum';
import { AchievementType } from './AchievementType';

export const Achievements: AchievementType[] = [
  {
    key: AchievementEnum.USER_AVATAR_SET,
    name: 'Face Forward',
    description: 'Showed us your dazzling smile (or cool avatar)!',
    levelPoints: [1],
  },
  {
    key: AchievementEnum.USER_FOLLOWED_USERS,
    name: 'Social Butterfly',
    description: 'Following all the cool people!',
    levelPoints: [1, 3, 10],
  },
  {
    key: AchievementEnum.USER_TASKS_ADDED,
    name: 'Task Generator',
    description: 'Keep up the good working adding tasks!',
    levelPoints: [1, 5, 10, 25, 50, 100, 500],
  },
  {
    key: AchievementEnum.USER_TASKS_COMPLETED,
    name: 'Task Slayer',
    description: 'Slaying those tasks like a boss!',
    levelPoints: [1, 5, 10, 25, 50, 100, 500],
  },
  {
    key: AchievementEnum.USER_MOOD_ENTRIES_ADDED,
    name: 'Moody',
    description: 'Keeping track of your moods!',
    levelPoints: [1, 5, 10, 25, 50, 100, 500],
  },
  {
    key: AchievementEnum.USER_HABITS_ADDED,
    name: 'Habitual',
    description: 'Building those habits!',
    levelPoints: [1, 5, 10, 25, 50, 100, 500],
  },
];

export const AchievementsMap = new Map(Achievements.map((a) => [a.key as AchievementEnum, a]));
