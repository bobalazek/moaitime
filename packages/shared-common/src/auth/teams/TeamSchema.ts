import { z } from 'zod';

import { PermissionsSchema } from '../../core/PermissionsSchema';

// Team Permissions
export const TeamPermissionsSchema = PermissionsSchema.extend({
  canInviteMember: z.boolean().optional(),
  canUpdateMember: z.boolean().optional(),
  canRemoveMember: z.boolean().optional(),
});

// Team
export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  permissions: TeamPermissionsSchema.optional(),
});

export const CreateTeamSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  color: z.string().optional(),
});

export const UpdateTeamSchema = CreateTeamSchema.partial();

// Types
export type TeamPermissions = z.infer<typeof TeamPermissionsSchema>;

export type Team = z.infer<typeof TeamSchema>;

export type CreateTeam = z.infer<typeof CreateTeamSchema>;

export type UpdateTeam = z.infer<typeof UpdateTeamSchema>;
