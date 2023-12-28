export enum ProcessingStatusEnum {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PROCESSED = 'processed',
  FAILED = 'failed',
}

// Also sync with schema/enums.ts in case you add any more values,
// because for some reason we can not just use the enum or const below

export const PROCESSING_STATUS_TYPES = Object.values(ProcessingStatusEnum);
