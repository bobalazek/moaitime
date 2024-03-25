import { HabitGoalFrequencyEnum } from './HabitGoalFrequencyEnum';
import { CreateHabit } from './HabitSchema';

export enum HabitTemplateCategoryEnum {
  HEALTH = '❤️ Health',
  PERSONAL = '🌟 Personal',
  WORK = '💻 Work',
  HOME = '🏠 Home',
  SOCIAL = '🧑‍🤝‍🧑 Social',
  OTHER = '❓ Other',
}

export type HabitTemplate = CreateHabit & { category: HabitTemplateCategoryEnum };

export const HabitTemplates: HabitTemplate[] = [
  // Health
  {
    name: 'Drink water',
    description: 'Drink 8 glasses of water',
    color: '#1E90FF',
    goalAmount: 8,
    goalUnit: 'glasses',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
];
