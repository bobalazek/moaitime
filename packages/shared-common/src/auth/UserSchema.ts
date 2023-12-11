import { z } from 'zod';

import { UserSettingsSchema } from './UserSettingsSchema';

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email(),
  newEmail: z.string().email().nullable(),
  roles: z.array(z.string()),
  settings: UserSettingsSchema,
  birthDate: z.string().nullable(),
  emailConfirmedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const updateUserSchema = z.object({
  displayName: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  birthDate: z.string().optional().nullable(),
});

export const updateUserPasswordSchema = z.object({
  newPassword: z.string().min(8).max(255),
  currentPassword: z.string().min(8).max(255).optional(),
});

export type User = z.infer<typeof UserSchema>;

export type UpdateUser = z.infer<typeof updateUserSchema>;

export type UpdateUserPassword = z.infer<typeof updateUserPasswordSchema>;
