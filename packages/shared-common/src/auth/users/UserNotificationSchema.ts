import { z } from 'zod';

import { UserNotificationTypeEnum } from './UserNotificationTypeEnum';

const dateToSting = (data: Date) => {
  return data.toISOString();
};

export const UserNotificationSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserNotificationTypeEnum),
  content: z.string(),
  link: z.string().nullable(),
  seenAt: z.date().transform(dateToSting).nullable(),
  readAt: z.date().transform(dateToSting).nullable(),
  createdAt: z.date().transform(dateToSting),
  updatedAt: z.date().transform(dateToSting),
  userId: z.string(),
});

// Types
export type UserNotification = z.infer<typeof UserNotificationSchema>;
