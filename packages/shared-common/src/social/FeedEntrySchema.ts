import { z } from 'zod';

import { PublicUserSchema } from '../auth/users/UserSchema';
import { PermissionsSchema } from '../core/PermissionsSchema';
import { PostSchema } from './PostSchema';

export const FeedEntrySchema = PostSchema.extend({
  user: PublicUserSchema,
  permissions: PermissionsSchema.optional(),
});

export type FeedEntry = z.infer<typeof FeedEntrySchema>;
