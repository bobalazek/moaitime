import { z } from 'zod';

// Report
export const CreateReportSchema = z.object({
  content: z.string({ required_error: 'Content is required' }),
  tags: z.array(z.string()).optional(),
});

// Types
export type CreateReport = z.infer<typeof CreateReportSchema>;
