import { z } from 'zod';

import { PlanSchema } from '../core/subscriptions/PlanSchema';
import { SubscriptionSchema } from '../core/subscriptions/SubscriptionSchema';
import { BaseUserAccessTokenSchema, UserSchema } from './users/UserSchema';

export const AuthSchema = z.object({
  user: UserSchema,
  userAccessToken: BaseUserAccessTokenSchema,
  plan: PlanSchema.nullable(),
  subscription: SubscriptionSchema.nullable(),
});

export type Auth = z.infer<typeof AuthSchema>;
