import { z } from 'zod';

export const OauthTokenSchema = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  prompt: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

export type OauthToken = z.infer<typeof OauthTokenSchema>;
