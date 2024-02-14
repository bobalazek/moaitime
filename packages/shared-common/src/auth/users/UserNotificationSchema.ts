import { z } from 'zod';

import { UserNotificationTypeEnum } from './UserNotificationTypeEnum';

export const UserNotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserNotificationTypeEnum),
  content: z.string(),
  targetEntity: z.string().nullable(),
  relatedEntities: z.array(z.string()),
  data: z.record(z.unknown()),
  seenAt: z.string(),
  readAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

// Types
export type UserNotification = z.infer<typeof UserNotificationSchema>;
