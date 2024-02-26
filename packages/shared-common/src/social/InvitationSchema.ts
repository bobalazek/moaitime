import { z } from 'zod';

export const InvitationSchema = z.object({
  id: z.string(),
  email: z.string(),
  expiresAt: z.string().nullable(),
  claimedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateInvitationSchema = z.object({
  email: z.string({ required_error: 'Email is required' }).email(),
});

// Types
export type Invitation = z.infer<typeof InvitationSchema>;

export type CreateInvitation = z.infer<typeof CreateInvitationSchema>;
