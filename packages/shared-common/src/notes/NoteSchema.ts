import { z } from 'zod';

const JsonBaseSchema = z.lazy(() => z.union([z.string(), z.number(), z.boolean(), z.null()]));

const JsonSchema = z.lazy(() =>
  z.union([JsonBaseSchema, z.array(JsonBaseSchema), z.record(z.string(), JsonBaseSchema)])
);

export const NoteContentSchema = z.array(z.record(z.string(), JsonSchema));

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
  content: NoteContentSchema.optional(),
  color: z.string().nullable().optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.partial();

// Types
export type Note = z.infer<typeof NoteSchema>;

export type CreateNote = z.infer<typeof CreateNoteSchema>;

export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
