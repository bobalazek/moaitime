import { AchievementType } from './AchievementType';

export enum AchievementEnum {
  FACE_FORWARD = 'face-forward',
}

export const Achievements: AchievementType[] = [
  {
    key: AchievementEnum.FACE_FORWARD,
    name: 'Face Forward',
    description:
      'Showed us your dazzling smile (or cool avatar)! Thanks for setting your profile picture.',
    levelPoints: [1],
  },
];
