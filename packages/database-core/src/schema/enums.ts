import { pgEnum } from 'drizzle-orm/pg-core';

import { ProcessingStatusEnum } from '@moaitime/shared-common';

export const processingStatusEnum = pgEnum('processing_status_enum', [
  ProcessingStatusEnum.PENDING,
  ProcessingStatusEnum.PROCESSING,
  ProcessingStatusEnum.PROCESSED,
  ProcessingStatusEnum.FAILED,
]);
