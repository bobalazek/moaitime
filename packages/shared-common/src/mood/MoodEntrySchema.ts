import { z } from 'zod';

import { EmotionsByCategory } from './Emotions';

const _emotionsSet = new Set(Object.values(EmotionsByCategory).flat());

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
  emotions: z
    .array(z.string())
    .refine(
      (values) => {
        if (!values || values.length === 0) {
          return true;
        }

        for (const emotion of values) {
          if (!_emotionsSet.has(emotion)) {
            return false;
          }
        }

        return true;
      },
      {
        message: 'Invalid emotions provided',
      }
    )
    .optional(),
  loggedAt: z.string({
    required_error: 'Please provide a date',
  }),
});

export const UpdateMoodEntrySchema = CreateMoodEntrySchema.partial();

// Types
export type MoodEntry = z.infer<typeof MoodEntrySchema>;

export type CreateMoodEntry = z.infer<typeof CreateMoodEntrySchema>;

export type UpdateMoodEntry = z.infer<typeof UpdateMoodEntrySchema>;
