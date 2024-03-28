import { z } from 'zod';

import { HabitSchema } from './HabitSchema';

export const HabitDailySchema = z.object({
  id: z.string(), // ${habitId}-${date}
  date: z.string(),
  amount: z.number(),
  goalProgressPercentage: z.number(),
  intervalProgressPercentage: z.number(),
  habit: HabitSchema,
  streak: z.number().optional(),
});

// Types
export type HabitDaily = z.infer<typeof HabitDailySchema>;
