import { z } from 'zod';

import { UserSettingsSchema } from './UserSettingsSchema';

// Public User
// Need that transform, so we don't need to manually do that every time in the UsersManager
const dateToSting = (data: Date) => {
  return new Date(data).toISOString();
};

export const PublicUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  username: z.string(),
  email: z.string().email(),
  avatarImageUrl: z.string().nullable(),
  biography: z.string().nullable(),
  isPrivate: z.boolean(),
  createdAt: z.date().transform(dateToSting),
  updatedAt: z.date().transform(dateToSting),
  lastActiveAt: z.date().transform(dateToSting).nullable().optional(),
  followersCount: z.number().optional(),
  followingCount: z.number().optional(),
  isMyself: z.boolean().optional(),
  myselfIsFollowingThisUser: z.union([z.boolean(), z.literal('pending')]).optional(),
  myselfIsFollowedByThisUser: z.union([z.boolean(), z.literal('pending')]).optional(),
  myselfIsBlockingThisUser: z.boolean().optional(),
});

// User
export const UserSchema = PublicUserSchema.extend({
  newEmail: z.string().email().nullable(),
  roles: z.array(z.string()),
  settings: UserSettingsSchema,
  birthDate: z.string().nullable(),
  emailConfirmedAt: z.string().nullable(),
});

// User Partials
export const UserDisplayNameSchema = z
  .string()
  .min(1, {
    message: 'Display name must be at least 1 character long',
  })
  .max(32, {
    message: 'Display name must be at most 32 characters long',
  });

export const UserEmailSchema = z.string().email({
  message: 'You must provide a valid email address',
});

export const UserUsernameSchema = z
  .string()
  .min(3, {
    message: 'Username must be at least 3 character long',
  })
  .max(32, {
    message: 'Username must be at most 32 characters long',
  })
  .regex(/^[a-z0-9-]*$/, {
    message: 'Username must be lowercase alphanumeric characters and may include dashes',
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

export const UserBiographySchema = z.string().max(255, {
  message: 'Biography must be at most 255 characters long',
});

// Update User
export const UpdateUserSchema = z.object({
  displayName: UserDisplayNameSchema.optional(),
  username: UserUsernameSchema.optional(),
  email: UserEmailSchema.optional(),
  birthDate: UserBirthDateSchema.optional().nullable(),
  biography: UserBiographySchema.optional(),
  isPrivate: z.boolean().optional(),
});

// User Password
export const UpdateUserPasswordSchema = z.object({
  newPassword: UserPasswordSchema,
  currentPassword: UserPasswordSchema.optional(), // The only reason it's optional is, because we will have OAuth in the future, where the user won't have a password
});

// Register User
export const RegisterUserSchema = z.object({
  displayName: UserDisplayNameSchema,
  username: UserUsernameSchema,
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
export type PublicUser = z.infer<typeof PublicUserSchema>;

export type User = z.infer<typeof UserSchema>;

export type UpdateUser = z.infer<typeof UpdateUserSchema>;

export type UpdateUserPassword = z.infer<typeof UpdateUserPasswordSchema>;

export type RegisterUser = z.infer<typeof RegisterUserSchema>;

export type UserAccessTokenLite = z.infer<typeof UserAccessTokenLiteSchema>;
