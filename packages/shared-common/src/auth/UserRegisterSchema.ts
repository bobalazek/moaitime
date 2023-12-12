import { z } from 'zod';

import { UserDisplayNameSchema, UserEmailSchema, UserPasswordSchema } from './UserSchema';
import { UserSettingsSchema } from './UserSettingsSchema';

export const UserRegisterSchema = z.object({
  displayName: UserDisplayNameSchema,
  email: UserEmailSchema,
  password: UserPasswordSchema,
  settings: UserSettingsSchema.pick({
    generalTimezone: true,
    clockUse24HourClock: true,
  }).optional(),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;
