import { z } from 'zod';

import { EditorNodeSchema } from '../core/EditorValueSchema';
import { isValidDate } from '../Helpers';
import { NoteTypeEnum } from './NoteTypeEnum';

export const NoteContentSchema = z.array(EditorNodeSchema, {
  required_error: 'Note content must be provided',
});

export const NoteSchema = z.object({
  id: z.string(),
  type: z.nativeEnum(NoteTypeEnum).default(NoteTypeEnum.NOTE),
  title: z.string(),
  content: NoteContentSchema,
  color: z.string().nullable(),
  directory: z.string().nullable(),
  journalDate: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateNoteSchema = z.object({
  type: z.nativeEnum(NoteTypeEnum).default(NoteTypeEnum.NOTE),
  title: z.string().trim().min(1, {
    message: 'Note title must be provided',
  }),
  content: NoteContentSchema,
  color: z.string().nullable().optional(),
  directory: z.string().nullable().optional(),
  journalDate: z // TODO: only allow and validate if type is journal_entry
    .string()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }

        return isValidDate(data);
      },
      {
        message: 'Journal date must be valid',
      }
    )
    .nullable()
    .optional(),
});

export const UpdateNoteSchema = CreateNoteSchema.omit({
  type: true,
});

// Types
export type Note = z.infer<typeof NoteSchema>;

export type CreateNote = z.infer<typeof CreateNoteSchema>;

export type UpdateNote = z.infer<typeof UpdateNoteSchema>;
