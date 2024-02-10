import { z } from 'zod';

export const ChangelogEntrySchema = z.object({
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  date: z.string(),
});

// Types
export type ChangelogEntry = z.infer<typeof ChangelogEntrySchema>;
