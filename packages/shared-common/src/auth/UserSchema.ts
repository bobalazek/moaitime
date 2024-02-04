import { z } from 'zod';

import { UserSettingsSchema } from './UserSettingsSchema';

export const UserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatarImageUrl: z.string().nullable(),
  email: z.string().email(),
  newEmail: z.string().email().nullable(),
  roles: z.array(z.string()),
  settings: UserSettingsSchema,
  birthDate: z.string().nullable(),
  emailConfirmedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// User Partials
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

export const UserBirthDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/i, {
  message: 'You must provide a valid date of birth',
});

// Update User
export const UpdateUserSchema = z.object({
  displayName: UserDisplayNameSchema.optional(),
  email: UserEmailSchema.optional(),
  birthDate: UserBirthDateSchema.optional().nullable(),
});

// User Password
export const UpdateUserPasswordSchema = z.object({
  newPassword: UserPasswordSchema,
  currentPassword: UserPasswordSchema.optional(), // The only reason it's optional is, because we will have OAuth in the future, where the user won't have a password
});

// Register User
export const RegisterUserSchema = z.object({
  displayName: UserDisplayNameSchema,
  email: UserEmailSchema,
  password: UserPasswordSchema,
  settings: UserSettingsSchema.pick({
    generalTimezone: true,
    clockUse24HourClock: true,
  }).optional(),
});

// User Access Token
export const UserAccessTokenLiteSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string().nullable(),
});

// Types
export type User = z.infer<typeof UserSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type UpdateUserPassword = z.infer<typeof UpdateUserPasswordSchema>;

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export type UserAccessTokenLite = z.infer<typeof UserAccessTokenLiteSchema>;
