import { z } from 'zod';

import { ColorSchema } from '../core/ColorSchema';

export const TagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: ColorSchema.nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateTagSchema = z.object({
  name: z.string().min(1, {
    message: 'Tag name must be provided',
  }),
  color: ColorSchema.nullable().optional(),
});

export const UpdateTagSchema = CreateTagSchema.partial();

// Types
export type Tag = z.infer<typeof TagSchema>;

export type CreateTag = z.infer<typeof CreateTagSchema>;

export type UpdateTag = z.infer<typeof UpdateTagSchema>;