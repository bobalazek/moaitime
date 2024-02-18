import { z } from 'zod';

import { EntityTypeEnum } from './EntityTypeEnum';

export const EntitySchema = z.object({
  id: z.string(),
  type: z.nativeEnum(EntityTypeEnum),
});

export type Entity = z.infer<typeof EntitySchema>;
