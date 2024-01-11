import { z } from 'zod';

export const PlanSchema = z.object({
  key: z.string(),
  name: z.string(),
});

// Types
export type Plan = z.infer<typeof PlanSchema>;
