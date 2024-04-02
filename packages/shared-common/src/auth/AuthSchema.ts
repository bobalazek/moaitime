import { z } from 'zod';

import { BaseUserAccessTokenSchema, UserSchema } from './users/UserSchema';

export const AuthSchema = z.object({
  user: UserSchema,
  userAccessToken: BaseUserAccessTokenSchema,
});

export type Auth = z.infer<typeof AuthSchema>;
