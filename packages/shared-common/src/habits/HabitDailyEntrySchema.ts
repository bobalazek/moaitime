import { z } from 'zod';

export const HabitDailyEntrySchema = z.object({
  id: z.string(),
  date: z.string(),
  amount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

// Types
export type HabitDailyEntry = z.infer<typeof HabitDailyEntrySchema>;
