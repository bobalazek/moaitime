import { z } from 'zod';

export const UserAchievementSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  points: z.number(),
  level: z.number(),
  currentLevelPoints: z.number(),
  nextLevelPoints: z.number(),
  nextLevelProgressPercentages: z.number(),
});

// Types
export type UserAchievement = z.infer<typeof UserAchievementSchema>;
