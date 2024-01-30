import { z } from 'zod';

import { TeamSchema } from './TeamSchema';
import { TeamUserRoleEnum } from './TeamUserRoleEnum';
import { UserSchema } from './UserSchema';

export const TeamUserSchema = z.object({
  id: z.string(),
  roles: z.array(z.nativeEnum(TeamUserRoleEnum)),
  teamId: z.string(),
  userId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  team: TeamSchema.optional(),
  user: UserSchema.optional(),
});

export const CreateTeamUserSchema = z.object({
  teamId: z.string({ required_error: 'Team is required' }),
});

export const UpdateTeamUserSchema = CreateTeamUserSchema.partial();

// Types
export type TeamUser = z.infer<typeof TeamUserSchema>;

export type CreateTeamUser = z.infer<typeof CreateTeamUserSchema>;

export type UpdateTeamUser = z.infer<typeof UpdateTeamUserSchema>;
