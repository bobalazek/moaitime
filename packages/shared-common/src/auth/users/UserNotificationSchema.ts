import { z } from 'zod';

import { EntitySchema } from '../../core/entities/EntitySchema';
import { UserNotificationTypeEnum } from './UserNotificationTypeEnum';

const dateToSting = (data: Date) => {
  return data.toISOString();
};

export const UserNotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserNotificationTypeEnum),
  content: z.string(),
  targetEntity: EntitySchema.nullable(),
  seenAt: z.string(),
  readAt: z.string(),
  createdAt: z.date().transform(dateToSting),
  updatedAt: z.date().transform(dateToSting),
  userId: z.string(),
});

// Types
export type UserNotification = z.infer<typeof UserNotificationSchema>;
