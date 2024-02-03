import { z } from 'zod';

import { FocusSessionEventTypeEnum } from './FocusSessionEventTypeEnum';
import { FocusSessionStageEnum } from './FocusSessionStageEnum';
import { FocusSessionStatusEnum } from './FocusSessionStatusEnum';

export const FocusSessionSettingsSchema = z.object({
  focusDurationSeconds: z
    .number()
    .min(60, {
      message: 'Focus duration must be at least 1 minute',
    })
    .max(60 * 1440, {
      message: 'Focus duration must be at most 3600 minutes',
    })
    .default(60 * 25)
    .refine((value) => value % 60 === 0, {
      message: 'Focus duration must be a round number of minutes',
    }),
  shortBreakDurationSeconds: z
    .number()
    .min(60, {
      message: 'Short break duration must be at least 1 minute',
    })
    .max(60 * 1440, {
      message: 'Short break duration must be at most 3600 minutes',
    })
    .default(5 * 60)
    .refine((value) => value % 60 === 0, {
      message: 'Focus duration must be a round number of minutes',
    }),
  longBreakDurationSeconds: z
    .number()
    .min(60, {
      message: 'Long break duration must be at least 1 minute',
    })
    .max(60 * 1440, {
      message: 'Long break duration must be at most 3600 minutes',
    })
    .default(15 * 60)
    .refine((value) => value % 60 === 0, {
      message: 'Focus duration must be a round number of minutes',
    }),
  focusRepetitionsCount: z
    .number()
    .min(1, {
      message: 'Focus repetitions count must be at least 1',
    })
    .max(64, {
      message: 'Focus repetitions count must be at most 64',
    })
    .default(4),
});

export const FocusSessionEventSchema = z.object({
  type: z.nativeEnum(FocusSessionEventTypeEnum),
  createdAt: z.string(),
});

export const FocusSessionSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(FocusSessionStatusEnum),
  taskText: z.string(),
  settings: FocusSessionSettingsSchema,
  events: z.array(FocusSessionEventSchema).nullable(),
  stage: z.nativeEnum(FocusSessionStageEnum),
  stageIteration: z.number(),
  stageProgressSeconds: z.number(),
  lastPingedAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  taskId: z.string().nullable(),
  userId: z.string(),
});

export const CreateFocusSessionSchema = z.object({
  taskText: z.string().min(1, { message: 'Task text must be at least 1 character long' }),
  settings: FocusSessionSettingsSchema,
  taskId: z.string().nullable().optional(),
});

export const UpdateFocusSessionSchema = CreateFocusSessionSchema.partial();

// Types
export type FocusSessionSettings = z.infer<typeof FocusSessionSettingsSchema>;

export type FocusSessionEvent = z.infer<typeof FocusSessionEventSchema>;

export type FocusSession = z.infer<typeof FocusSessionSchema>;

export type CreateFocusSession = z.infer<typeof CreateFocusSessionSchema>;

export type UpdateFocusSession = z.infer<typeof UpdateFocusSessionSchema>;
