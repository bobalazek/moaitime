import { z } from 'zod';

import { PostStatusTypeEnum } from './PostStatusTypeEnum';
import { PostTypeEnum } from './PostTypeEnum';
import { PostVisibilityEnum } from './PostVisibilityEnum';

export const PostSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(PostTypeEnum),
  subType: z.nativeEnum(PostStatusTypeEnum).nullable(),
  visibility: z.nativeEnum(PostVisibilityEnum),
  content: z.string(),
  deletedAt: z.string().nullable(),
  publishedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type Post = z.infer<typeof PostSchema>;
