import { z } from 'zod';

import { UserAccessTokenSchema } from './UserAccessToken';
import { UserSchema } from './UserSchema';

export const AuthSchema = z.object({
  user: UserSchema,
  userAccessToken: UserAccessTokenSchema,
});

export type Auth = z.infer<typeof AuthSchema>;
