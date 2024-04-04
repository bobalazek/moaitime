import { z } from 'zod';

export const OauthUserInfoSchema = z.object({
  sub: z.string(),
  email: z.string().optional(),
  emailVerified: z.boolean().optional(),
  preferredUsername: z.string().optional(),
  displayName: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  locale: z.string().optional(),
  avatarUrl: z.string().optional(),
});

export type OauthUserInfo = z.infer<typeof OauthUserInfoSchema>;
