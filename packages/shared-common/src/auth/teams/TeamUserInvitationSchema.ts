import { z } from 'zod';

import { UserSchema } from '../users/UserSchema';
import { TeamSchema } from './TeamSchema';
import { TeamUserRoleEnum } from './TeamUserRoleEnum';

export const TeamUserInvitationSchema = z.object({
  id: z.string(),
  roles: z.array(z.nativeEnum(TeamUserRoleEnum)),
  email: z.string(),
  teamId: z.string(),
  expiresAt: z.string().nullable(),
  acceptedAt: z.string().nullable(),
  rejectedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  team: TeamSchema.optional(),
  invitedByUser: UserSchema.optional(),
});

export const CreateTeamUserInvitationSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
  teamId: z.string({ required_error: 'Team is required' }),
});

export const UpdateTeamUserInvitationSchema = CreateTeamUserInvitationSchema.partial();

// Types
export type TeamUserInvitation = z.infer<typeof TeamUserInvitationSchema>;

export type CreateTeamUserInvitation = z.infer<typeof CreateTeamUserInvitationSchema>;

export type UpdateTeamUserInvitation = z.infer<typeof UpdateTeamUserInvitationSchema>;
