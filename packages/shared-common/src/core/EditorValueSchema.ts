import { z } from 'zod';

export const EditorNodeBaseSchema = z.object({
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
  lineHeight: z.union([z.number(), z.string()]).optional(),
  url: z.string().optional(),
  size: z.union([z.number(), z.string()]).optional(),
  colSizes: z.array(z.union([z.number(), z.string()])).optional(),
  borders: z
    .record(
      z.object({
        size: z.union([z.number(), z.string()]).optional(),
      })
    )
    .optional(),
});

export type EditorNode = z.infer<typeof EditorNodeBaseSchema> & {
  children?: EditorNode[];
};

export const EditorNodeSchema: z.ZodType<EditorNode> = EditorNodeBaseSchema.extend({
  children: z.lazy(() => z.array(EditorNodeSchema)).optional(),
});
