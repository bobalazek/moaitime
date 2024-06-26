import { z } from 'zod';

export const MoodEntrySchema = z.object({
  id: z.string(),
  happinessScore: z.number(),
  note: z.string().nullable(),
  emotions: z.array(z.string()),
  loggedAt: z.string(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateMoodEntrySchema = z.object({
  happinessScore: z
    .number({
      required_error: 'Please provide a happiness score',
    })
    .min(-2)
    .max(2),
  note: z.string().nullable().optional(),
  emotions: z.array(z.string()).optional(),
  loggedAt: z.string({
    required_error: 'Please provide a date',
  }),
});

export const UpdateMoodEntrySchema = CreateMoodEntrySchema.partial();

// Types
export type MoodEntry = z.infer<typeof MoodEntrySchema>;

export type CreateMoodEntry = z.infer<typeof CreateMoodEntrySchema>;

export type UpdateMoodEntry = z.infer<typeof UpdateMoodEntrySchema>;
