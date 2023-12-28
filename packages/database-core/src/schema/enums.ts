import { pgEnum } from 'drizzle-orm/pg-core';

export const processingStatusEnum = pgEnum('processing_status_enum', [
  'pending',
  'processing',
  'processed',
  'failed',
]);
