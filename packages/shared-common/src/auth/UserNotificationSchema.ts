import { z } from 'zod';

export const UserNotificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  content: z.string(),
  seenAt: z.string(),
  readAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

// Types
export type UserNotification = z.infer<typeof UserNotificationSchema>;
