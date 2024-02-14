import { z } from 'zod';

export const TeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateTeamSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
});

export const UpdateTeamSchema = CreateTeamSchema.partial();

// Types
export type Team = z.infer<typeof TeamSchema>;

export type CreateTeam = z.infer<typeof CreateTeamSchema>;

export type UpdateTeam = z.infer<typeof UpdateTeamSchema>;
