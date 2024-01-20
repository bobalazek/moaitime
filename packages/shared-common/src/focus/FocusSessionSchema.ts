import { z } from 'zod';

export const FocusSessionSchema = z.object({
  id: z.string(),
  taskText: z.string().nullable(),
  startedAt: z.string(),
  endsAt: z.string(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateFocusSessionSchema = z.object({
  taskText: z.string().nullable().optional(),
});

export const UpdateFocusSessionSchema = CreateFocusSessionSchema.partial();

// Types
export type FocusSession = z.infer<typeof FocusSessionSchema>;

export type CreateFocusSession = z.infer<typeof CreateFocusSessionSchema>;

export type UpdateFocusSession = z.infer<typeof UpdateFocusSessionSchema>;
