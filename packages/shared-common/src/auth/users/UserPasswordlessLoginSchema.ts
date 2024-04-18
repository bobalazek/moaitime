import { z } from 'zod';

import { UserPasswordlessLoginTypeEnum } from './UserPasswordlessLoginTypeEnum';

const dateToSting = (data: Date) => {
  return data.toISOString();
};

export const UserPasswordlessLoginSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(UserPasswordlessLoginTypeEnum),
  token: z.string(),
  approvedAt: z.date().transform(dateToSting).nullable(),
  rejectedAt: z.date().transform(dateToSting).nullable(),
  createdAt: z.date().transform(dateToSting),
  updatedAt: z.date().transform(dateToSting),
  userId: z.string(),
});

// Types
export type UserPasswordlessLogin = z.infer<typeof UserPasswordlessLoginSchema>;
