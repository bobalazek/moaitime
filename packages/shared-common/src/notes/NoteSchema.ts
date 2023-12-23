import { z } from 'zod';

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  color: z.string().nullable(),
  directory: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  listId: z.string(),
});

export const CreateNoteSchema = z.object({
  title: z.string().min(1, {
    message: 'Note title must be provided',
  }),
  conent: z.string().optional(),
  color: z.string().nullable().optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

// Types
export type Note = z.infer<typeof NoteSchema>;

export type CreateNote = z.infer<typeof CreateNoteSchema>;

export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
