import { z } from 'zod';

export const SubscriptionSchema = z.object({
  id: z.string(),
  planKey: z.string(),
  cancelReason: z.string().nullable(),
  canceledAt: z.string(),
  startedAt: z.string(),
  endsAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Types
export type Subscription = z.infer<typeof SubscriptionSchema>;
