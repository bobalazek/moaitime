import { z } from 'zod';

export const NoteNodeSchema = z.object({
  type: z.string().optional(),
  text: z.string().optional(),
});

export const NodeNodeWithChildrenSchema = NoteNodeSchema.extend({
  children: z.array(NoteNodeSchema).optional(),
});

export const NoteContentSchema = z.array(NodeNodeWithChildrenSchema, {
  required_error: 'Note content must be provided',
});

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: NoteContentSchema,
  color: z.string().nullable(),
  directory: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateNoteSchema = z.object({
  title: z.string().min(1, {
    message: 'Note title must be provided',
  }),
  content: NoteContentSchema,
  color: z.string().nullable().optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

// Types
export type Note = z.infer<typeof NoteSchema>;

export type CreateNote = z.infer<typeof CreateNoteSchema>;

export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
