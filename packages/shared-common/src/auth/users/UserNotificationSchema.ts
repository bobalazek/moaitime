import { z } from 'zod';

import { EntitySchema } from '../../core/entities/EntitySchema';
import { UserNotificationTypeEnum } from './UserNotificationTypeEnum';

export const UserNotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserNotificationTypeEnum),
  content: z.string(),
  targetEntity: EntitySchema.nullable(),
  relatedEntities: z.array(EntitySchema),
  data: z.record(z.unknown()),
  seenAt: z.string(),
  readAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

// Types
export type UserNotification = z.infer<typeof UserNotificationSchema>;
