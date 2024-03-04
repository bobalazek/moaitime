import { z } from 'zod';

import { HabitSchema } from './HabitSchema';

export const HabitDailySchema = z.object({
  id: z.string(), // ${habitId}-${date}
  date: z.string(),
  amount: z.number(),
  habit: HabitSchema,
});

// Types
export type HabitDaily = z.infer<typeof HabitDailySchema>;
