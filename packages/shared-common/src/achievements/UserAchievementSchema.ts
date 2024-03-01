import { z } from 'zod';

export const UserAchievementSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  points: z.number(),
  level: z.number(),
  currentLevelPoints: z.number(),
  nextLevelPoints: z.number(),
  nextLevelProgressPercentage: z.number(),
  hasReachedMaxProgress: z.boolean(),
});

// Types
export type UserAchievement = z.infer<typeof UserAchievementSchema>;
