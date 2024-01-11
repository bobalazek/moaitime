import { z } from 'zod';

export const MoodEntrySchema = z.object({
  id: z.string(),
  happinessScore: z.number(),
  note: z.string().nullable(),
  loggedAt: z.string(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateMoodEntrySchema = z.object({
  happinessScore: z
    .number({
      required_error: 'Please provide a happiness score',
    })
    .min(-2)
    .max(2),
  note: z.string().nullable().optional(),
  loggedAt: z.string({
    required_error: 'Please provide a date',
  }),
});

export const UpdateMoodEntrySchema = CreateMoodEntrySchema.partial();

// Types
export type MoodEntry = z.infer<typeof MoodEntrySchema>;

export type CreateMoodEntry = z.infer<typeof CreateMoodEntrySchema>;

export type UpdateMoodEntry = z.infer<typeof UpdateMoodEntrySchema>;