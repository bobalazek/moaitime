import { z } from 'zod';

export const PermissionsSchema = z.object({
  canView: z.boolean().optional(),
  canUpdate: z.boolean().optional(),
  canDelete: z.boolean().optional(),
});

export type Permissions = z.infer<typeof PermissionsSchema>;
