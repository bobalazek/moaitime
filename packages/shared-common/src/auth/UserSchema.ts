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

export const UserDisplayNameSchema = z
  .string()
  .min(1, {
    message: 'Display name must be at least 1 character long',
  })
  .max(255);

export const UserEmailSchema = z.string().email({
  message: 'You must provide a valid email address',
});

export const UserPasswordSchema = z
  .string()
  .min(8, {
    message: 'Password must be at least 8 characters long',
  })
  .max(255, {
    message: 'Password must be at most 255 characters long',
  });

export const UserBirthDateSchema = z.date({
  errorMap: (error) => ({
    message: 'You must provide a valid date of birth',
    path: error.path,
  }),
});

export const UpdateUserSchema = z.object({
  displayName: UserDisplayNameSchema.optional(),
  email: UserEmailSchema.optional(),
  birthDate: UserBirthDateSchema.optional().nullable(),
});

export const UpdateUserPasswordSchema = z.object({
  newPassword: UserPasswordSchema,
  currentPassword: UserPasswordSchema.optional(), // The only reason it's optional is, because we will have OAuth in the future, where the user won't have a password
});

export type User = z.infer<typeof UserSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type UpdateUserPassword = z.infer<typeof UpdateUserPasswordSchema>;
