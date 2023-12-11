import { z } from 'zod';

export const UserAccessTokenSchema = z.object({
  token: z.string(),
  refreshToken: z.string(),
  expiresAt: z.string().nullable(),
});

export type UserAccessToken = z.infer<typeof UserAccessTokenSchema>;
