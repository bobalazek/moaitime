import { z } from 'zod';

import { UserSettingsSchema } from './UserSettingsSchema';

export const UserRegisterSchema = z.object({
  displayName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(50),
  settings: UserSettingsSchema.pick({
    generalTimezone: true,
    clockUse24HourClock: true,
  }).optional(),
});

export type UserRegister = z.infer<typeof UserRegisterSchema>;
