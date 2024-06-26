import { HabitGoalFrequencyEnum } from './HabitGoalFrequencyEnum';
import { CreateHabit } from './HabitSchema';

export enum HabitTemplateCategoryEnum {
  HEALTH = 'Health',
  PERSONAL = 'Personal',
  WORK = 'Work',
  HOME = 'Home',
  SOCIAL = 'Social',
  OTHER = 'Other',
}

export type HabitTemplate = CreateHabit & { category: HabitTemplateCategoryEnum };

export const habitTemplates: HabitTemplate[] = [
  // Health
  {
    name: '💧 Drink water',
    description:
      'Turn hydration into a daily treasure hunt. 2.5 liters of water to keep your adventure going strong.',
    color: '#3B82F6',
    goalAmount: 25,
    goalUnit: 'deciliters',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🌙 Sleep',
    description: 'Secure 7-9 hours of sleep to unlock the superpowers of energy and clarity.',
    color: '#6366F1',
    goalAmount: 8,
    goalUnit: 'hours',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🚶 Go for a walk',
    description: 'Embark on a 20-minute daily discovery walk. Fresh air, fresh thoughts.',
    color: '#84CC16',
    goalAmount: 20,
    goalUnit: 'minutes',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🏋️ Exercise',
    description:
      'Fuel your day with 30 minutes of exercise. Energize your body, elevate your mood.',
    color: '#EF4444',
    goalAmount: 30,
    goalUnit: 'minutes',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🤸 Strech',
    description:
      "10 minutes of stretching to unlock your body's full range of motion. Feel like a well-oiled machine.",
    color: '#60A5FA',
    goalAmount: 10,
    goalUnit: 'minutes',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🧘 Meditate',
    description:
      'A 10-minute daily mental retreat to reduce stress and clear the mind. Peace in, stress out.',
    color: '#06B6D4',
    goalAmount: 10,
    goalUnit: 'minutes',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🥦 Eat vegetables',
    description: 'Make each meal a veggie feast. A splash of color, a boost of health.',
    color: '#10B981',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🍎 Eat fruits',
    description: "Daily fruits to sweeten your day the natural way. Nature's candy at its best.",
    color: '#F97316',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🚫🍬 Avoid sugar',
    description: 'Take the no-added-sugar challenge. Rediscover the sweetness of life.',
    color: '#6B7280',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🚫🍔 Avoid processed food',
    description: 'Say yes to whole foods, no to processed. Your body will thank you.',
    color: '#7C3AED',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🚫🍟 Avoid fast food',
    description: 'Choose fresh over fast. Homemade for health and happiness.',
    color: '#6B7280',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  {
    name: '🍳 Eat breakfast',
    description: 'Start your day with a breakfast boost. Fuel for champions.',
    color: '#FCD34D',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HEALTH,
  },
  //Personal
  {
    name: '🛠️ Practise a new skill',
    description: '30 minutes a day to learn something new. Grow your skill tree.',
    color: '#EC4899',
    goalAmount: 30,
    goalUnit: 'minutes',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.PERSONAL,
  },
  {
    name: '📚 Read a book',
    description: 'One book a month for endless adventures. Knowledge and imagination unlocked.',
    color: '#6366F1',
    goalAmount: 1,
    goalUnit: 'items',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.PERSONAL,
  },
  {
    name: '📅 Meal planning',
    description: 'Weekly meal planning for health, savings, and culinary fun.',
    color: '#84CC16',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.PERSONAL,
  },
  {
    name: '🛁 Self-care',
    description: 'An hour a week dedicated to self-care. Recharge your soul.',
    color: '#EC4899',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.PERSONAL,
  },
  {
    name: '💸 Track expenses',
    description: 'Weekly expense tracking for financial clarity and control.',
    color: '#F97316',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.PERSONAL,
  },
  {
    name: '⏳ Cultivate Patience',
    description: 'Daily patience practice for a peaceful mind and harmonious life.',
    color: '#60A5FA',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.PERSONAL,
  },
  // Work
  {
    name: '⚙️ Efficiency Improvement',
    description:
      'Boost your workday productivity with a new tool or system. A daily dose of efficiency magic.',
    color: '#06B6D4',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.WORK,
  },
  {
    name: '👥 Networking',
    description:
      'Expand your professional circle by connecting with a new colleague each month. Network, grow, succeed.',
    color: '#FCD34D',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.MONTH,
    category: HabitTemplateCategoryEnum.WORK,
  },
  {
    name: '📈 Professional Development',
    description:
      'Sharpen your focus with time blocking. Daily dedication to becoming your best professional self.',
    color: '#10B981',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.WORK,
  },
  {
    name: '⏱️ Time Blocking',
    description:
      'Level up your skills with weekly workshops or seminars. Knowledge is power, and growth is the goal.',
    color: '#84CC16',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.WORK,
  },
  // Home
  {
    name: '🗑️ Declutter',
    description: 'Embrace minimalism by decluttering a space each month. Clean space, clear mind.',
    color: '#6B7280',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.MONTH,
    category: HabitTemplateCategoryEnum.HOME,
  },
  {
    name: '🔨 Home Improvement',
    description: 'Quarterly projects to transform your living space. Create, improve, enjoy.',
    color: '#F97316',
    goalAmount: 4,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.YEAR,
    category: HabitTemplateCategoryEnum.HOME,
  },
  {
    name: '🌱 Gardening',
    description:
      'Weekly green thumb exercise. Grow a garden or tend houseplants for a happier home.',
    color: '#10B981',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.HOME,
  },
  {
    name: '💦 Water Conservation',
    description:
      'Adopt daily water-saving habits. Shorter showers, fixed leaks for a greener planet.',
    color: '#3B82F6',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HOME,
  },
  {
    name: '🧹 Daily Cleaning',
    description: '15 minutes a day keeps the chaos away. Tidy up for a sparkling sanctuary.',
    color: '#60A5FA',
    goalAmount: 15,
    goalUnit: 'minutes',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.HOME,
  },
  // Social
  {
    name: '📞 Call parents',
    description: 'Twice-a-week check-ins with your folks. Strengthen bonds, share love.',
    color: '#EC4899',
    goalAmount: 2,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.SOCIAL,
  },
  {
    name: '🤙 Call friends',
    description: 'Weekly calls to friends. Keep the connections alive and thriving.',
    color: '#FCD34D',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.SOCIAL,
  },
  {
    name: '🍽️ Host a Dinner party',
    description:
      'Host a dinner once a month to celebrate and strengthen bonds with friends or family.',
    color: '#EF4444',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.MONTH,
    category: HabitTemplateCategoryEnum.SOCIAL,
  },
  {
    name: '🤝 Community Service',
    description: 'Give back with quarterly volunteering. Support your community, enrich your soul.',
    color: '#10B981',
    goalAmount: 4,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.YEAR,
    category: HabitTemplateCategoryEnum.SOCIAL,
  },
  {
    name: '🎁 Express Appreciation',
    description: 'Daily gratitude towards friends and family. Small gestures, big impacts.',
    color: '#7C3AED',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.SOCIAL,
  },
  {
    name: '👨‍🏫 Mentorship',
    description: 'Find or become a mentor. Share knowledge, guide, and grow together daily.',
    color: '#6366F1',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.SOCIAL,
  },
  // Other
  {
    name: '✈️ Travel',
    description:
      'Plan an annual trip to discover new places, immersing yourself in different cultures.',
    color: '#06B6D4',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.YEAR,
    category: HabitTemplateCategoryEnum.OTHER,
  },
  {
    name: '♻️ Sustainability',
    description: 'Everyday eco-friendly actions. Reuse, recycle, reduce your footprint.',
    color: '#84CC16',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.OTHER,
  },
  {
    name: '🏪 Support Local Businesses',
    description: "Daily support for local gems. Boost your community's economy and spirit.",
    color: '#FCD34D',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.DAY,
    category: HabitTemplateCategoryEnum.OTHER,
  },
  {
    name: '🎤 Public Speaking',
    description:
      'Challenge yourself with public speaking opportunities each quarter to build confidence and influence.',
    color: '#EF4444',
    goalAmount: 4,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.YEAR,
    category: HabitTemplateCategoryEnum.OTHER,
  },
  {
    name: '📖 Life Documentation',
    description:
      "Weekly journaling or blogging to capture life's moments. Reflect, appreciate, grow.",
    color: '#60A5FA',
    goalAmount: 1,
    goalUnit: 'times',
    goalFrequency: HabitGoalFrequencyEnum.WEEK,
    category: HabitTemplateCategoryEnum.OTHER,
  },
];
