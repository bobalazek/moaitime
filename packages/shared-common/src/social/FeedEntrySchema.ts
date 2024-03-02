import { z } from 'zod';

import { PostSchema } from './PostSchema';

export const FeedEntrySchema = PostSchema;

export type FeedEntry = z.infer<typeof FeedEntrySchema>;
