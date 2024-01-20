import { z } from 'zod';

import { FocusSessionEventTypeEnum } from './FocusSessionEventTypeEnum';
import { FocusSessionStatusEnum } from './FocusSessionStatusEnum';

export const FocusSessionSettingsSchema = z.object({
  pomodoroDurationSeconds: z.number(),
  shortBreakDurationSeconds: z.number(),
  longBreakDurationSeconds: z.number(),
  pomodoroCount: z.number(),
  longBreakInterval: z.number(),
});

export const FocusSessionEventSchema = z.object({
  type: z.nativeEnum(FocusSessionEventTypeEnum),
  startedAt: z.string(),
  endedAt: z.string().nullable(),
});

export const FocusSessionSchema = z.object({
  id: z.string(),
  status: z.nativeEnum(FocusSessionStatusEnum),
  taskText: z.string().nullable(),
  settings: FocusSessionSettingsSchema.nullable(),
  events: z.array(FocusSessionEventSchema).nullable(),
  activeSeconds: z.number(),
  lastPingAt: z.string().nullable(),
  completedAt: z.string().nullable(),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  taskId: z.string().nullable(),
});

export const CreateFocusSessionSchema = z.object({
  taskText: z.string().nullable().optional(),
  settings: FocusSessionSettingsSchema.optional(),
  taskId: z.string().nullable().optional(),
});

export const UpdateFocusSessionSchema = CreateFocusSessionSchema.partial();

// Types
export type FocusSessionSettings = z.infer<typeof FocusSessionSettingsSchema>;

export type FocusSessionEvent = z.infer<typeof FocusSessionEventSchema>;

export type FocusSession = z.infer<typeof FocusSessionSchema>;

export type CreateFocusSession = z.infer<typeof CreateFocusSessionSchema>;

export type UpdateFocusSession = z.infer<typeof UpdateFocusSessionSchema>;