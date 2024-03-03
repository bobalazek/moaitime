import { z } from 'zod';

import { PublicUserSchema } from '../auth/users/UserSchema';
import { PermissionsSchema } from '../core/PermissionsSchema';
import { PostSchema } from './PostSchema';

export const FeedPostSchema = PostSchema.extend({
  user: PublicUserSchema,
  permissions: PermissionsSchema.optional(),
});

export type FeedPost = z.infer<typeof FeedPostSchema>;
