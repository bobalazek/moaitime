import { z } from 'zod';

export const FeedbackEntrySchema = z.object({
  id: z.string(),
  message: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  userId: z.string(),
});

export const CreateFeedbackEntrySchema = z.object({
  message: z.string(),
});

// Types
export type FeedbackEntry = z.infer<typeof FeedbackEntrySchema>;

export type CreateFeedbackEntry = z.infer<typeof CreateFeedbackEntrySchema>;
