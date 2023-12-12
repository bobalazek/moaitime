import { z } from 'zod';

import { UserAccessTokenLiteSchema, UserSchema } from './UserSchema';

export const AuthSchema = z.object({
  user: UserSchema,
  userAccessToken: UserAccessTokenLiteSchema,
});

export type Auth = z.infer<typeof AuthSchema>;
