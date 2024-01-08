import { z } from 'zod';

import { isValidDate } from '../Helpers';
import { NoteTypeEnum } from './NoteTypeEnum';

export const NoteNodeSchema = z.object({
  id: z.string().optional(),
  type: z.string().optional(),
  text: z.string().optional(),
  indent: z.number().optional(),
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional(),
  strikethrough: z.boolean().optional(),
  code: z.boolean().optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  highlight: z.string().optional(),
  align: z.string().optional(),
  url: z.string().optional(),
});

export type NoteNode = z.infer<typeof NoteNodeSchema> & {
  children?: NoteNode[];
};

export const NodeNodeWithChildrenSchema: z.ZodType<NoteNode> = NoteNodeSchema.extend({
  children: z.lazy(() => z.array(NodeNodeWithChildrenSchema)).optional(),
});

export const NoteContentSchema = z.array(NodeNodeWithChildrenSchema, {
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
  title: z.string().min(1, {
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
