import { z } from 'zod';

import { PostTypeEnum } from './PostTypeEnum';
import { PostVisibilityEnum } from './PostVisibilityEnum';

export const PostSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(PostTypeEnum),
  visibility: z.nativeEnum(PostVisibilityEnum),
  content: z.string(),
  deletedAt: z.string().nullable(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
