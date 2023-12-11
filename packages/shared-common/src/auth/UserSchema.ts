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

export const UserPasswordSchema = z.string().min(8).max(255);

export const UpdateUserSchema = z.object({
  displayName: z.string().min(3).max(255).optional(),
  email: z.string().email().optional(),
  birthDate: z.string().optional().nullable(),
});

export const UpdateUserPasswordSchema = z.object({
  newPassword: UserPasswordSchema,
  currentPassword: UserPasswordSchema.optional(),
});

export type User = z.infer<typeof UserSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type UpdateUserPassword = z.infer<typeof UpdateUserPasswordSchema>;
