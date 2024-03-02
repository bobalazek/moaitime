import { z } from 'zod';

import { PublicUserSchema } from '../auth/users/UserSchema';
import { PostSchema } from './PostSchema';

export const FeedEntrySchema = PostSchema.extend({
  user: PublicUserSchema,
});

export type FeedEntry = z.infer<typeof FeedEntrySchema>;
