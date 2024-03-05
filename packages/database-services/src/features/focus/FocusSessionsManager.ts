import { and, count, DBQueryConfig, desc, eq, isNull } from 'drizzle-orm';

import { FocusSession, focusSessions, getDatabase, NewFocusSession } from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  CreateFocusSession,
  FocusSessionEventTypeEnum,
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  getFocusSessionDurationForCurrentStage,
  getTimeDifferenceInSeconds,
  GlobalEventsEnum,
} from '@moaitime/shared-common';

import { tasksManager } from '../tasks/TasksManager';

export class FocusSessionsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<FocusSession[]> {
    return getDatabase().query.focusSessions.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<FocusSession[]> {
    return getDatabase().query.focusSessions.findMany({
      where: and(eq(focusSessions.userId, userId), isNull(focusSessions.deletedAt)),
      orderBy: desc(focusSessions.createdAt),
      with: {
        task: true,
      },
    });
  }

  async findOneById(id: string): Promise<FocusSession | null> {
    const row = await getDatabase().query.focusSessions.findFirst({
      where: eq(focusSessions.id, id),
      with: {
        task: true,
      },
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<FocusSession | null> {
    const row = await getDatabase().query.focusSessions.findFirst({
      where: and(eq(focusSessions.id, id), eq(focusSessions.userId, userId)),
      with: {
        task: true,
      },
    });

    return row ?? null;
  }

  async findOneCurrentAndByUserId(userId: string): Promise<FocusSession | null> {
    const row = await getDatabase().query.focusSessions.findFirst({
      where: and(
        isNull(focusSessions.completedAt),
        eq(focusSessions.userId, userId),
        isNull(focusSessions.deletedAt)
      ),
      with: {
        task: true,
      },
      orderBy: desc(focusSessions.createdAt),
    });

    return row ?? null;
  }

  async insertOne(data: NewFocusSession): Promise<FocusSession> {
    const rows = await getDatabase().insert(focusSessions).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewFocusSession>): Promise<FocusSession> {
    const rows = await getDatabase()
      .update(focusSessions)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(focusSessions.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<FocusSession> {
    const rows = await getDatabase()
      .delete(focusSessions)
      .where(eq(focusSessions.id, id))
      .returning();

    return rows[0];
  }

  // Permissions
  async userCanView(userId: string, focusSessionId: string): Promise<boolean> {
    const row = await getDatabase().query.focusSessions.findFirst({
      where: and(eq(focusSessions.id, focusSessionId), eq(focusSessions.userId, userId)),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, focusSessionId: string): Promise<boolean> {
    return this.userCanView(userId, focusSessionId);
  }

  async userCanDelete(userId: string, focusSessionId: string): Promise<boolean> {
    return this.userCanUpdate(userId, focusSessionId);
  }

  // Helpers
  async create(userId: string, data: CreateFocusSession) {
    const currentFocusSession = await this.findOneCurrentAndByUserId(userId);
    if (currentFocusSession) {
      throw new Error('You already have an open focus session');
    }

    if (data.taskId) {
      const canView = await tasksManager.userCanView(userId, data.taskId);
      if (!canView) {
        throw new Error('Task not found');
      }
    }

    const focusSession = await this.insertOne({
      ...data,
      userId,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.FOCUS_FOCUS_SESSION_ADDED, {
      actorUserId: userId,
      focusSessionId: focusSession.id,
    });

    return focusSession;
  }

  async view(userId: string, focusSessionId: string, updatePing?: boolean) {
    let data =
      focusSessionId === 'current'
        ? await this.findOneCurrentAndByUserId(userId)
        : await this.findOneByIdAndUserId(focusSessionId, userId);

    if (updatePing && data) {
      data = await this.updateFocusSession(userId, data, FocusSessionUpdateActionEnum.PING);
    }

    return data;
  }

  async action(userId: string, focusSessionId: string, action: FocusSessionUpdateActionEnum) {
    const focusSession =
      focusSessionId === 'current'
        ? await this.findOneCurrentAndByUserId(userId)
        : await this.findOneByIdAndUserId(focusSessionId, userId);

    if (!focusSession) {
      throw new Error('Focus session not found');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.FOCUS_FOCUS_SESSION_ACTION_TRIGGERED, {
      actorUserId: userId,
      focusSessionId: focusSession.id,
      action,
    });

    return this.updateFocusSession(userId, focusSession, action);
  }

  async delete(userId: string, focusSessionId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(userId, focusSessionId);
    if (!canDelete) {
      throw new Error('Focus session not found');
    }

    const focusSession = isHardDelete
      ? await this.deleteOneById(focusSessionId)
      : await this.updateOneById(focusSessionId, {
          deletedAt: new Date(),
        });

    globalEventsNotifier.publish(GlobalEventsEnum.FOCUS_FOCUS_SESSION_DELETED, {
      actorUserId: userId,
      focusSessionId: focusSession.id,
      isHardDelete,
    });

    return focusSession;
  }

  async undelete(userId: string, focusSessionId: string) {
    const canDelete = await this.userCanUpdate(userId, focusSessionId);
    if (!canDelete) {
      throw new Error('You cannot undelete this focus session');
    }

    const focusSession = await this.updateOneById(focusSessionId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.FOCUS_FOCUS_SESSION_UNDELETED, {
      actorUserId: userId,
      focusSessionId: focusSession.id,
    });

    return focusSession;
  }

  async updateFocusSession(
    userId: string,
    focusSession: FocusSession,
    action: FocusSessionUpdateActionEnum
  ): Promise<FocusSession> {
    if (!Object.values(FocusSessionUpdateActionEnum).includes(action)) {
      throw new Error(`Update action "${action}" not found`);
    }

    if (focusSession.completedAt) {
      throw new Error('Focus session is already completed');
    }

    // Variables
    const data: Partial<NewFocusSession> = {};

    const now = new Date();
    const nowString = now.toISOString();
    const lastActiveAt = focusSession.lastPingedAt ?? focusSession.createdAt ?? now;

    const currentFocusSessionStatus = focusSession.status;
    const currentFocusSessionEvents = focusSession.events ?? [];
    const currentFocusSessionStage = focusSession.stage;
    const currentFocusSessionStageIteration = focusSession.stageIteration ?? 1;

    const focusSessionStageDurationSeconds = getFocusSessionDurationForCurrentStage(focusSession);
    const focusSessionTotalIterations = focusSession.settings?.focusRepetitionsCount ?? 1;

    const focusSessionHasDoneAllIterations =
      currentFocusSessionStageIteration >= focusSessionTotalIterations;

    // Progress seconds
    let focusSessionStageProgressSeconds = focusSession.stageProgressSeconds ?? 0;

    if (currentFocusSessionStatus !== FocusSessionStatusEnum.PAUSED) {
      const additionalSeconds = getTimeDifferenceInSeconds(now, lastActiveAt);
      focusSessionStageProgressSeconds += additionalSeconds;
    }

    // State and status logic
    if (action === FocusSessionUpdateActionEnum.PAUSE) {
      if (focusSession.status !== FocusSessionStatusEnum.ACTIVE) {
        throw new Error('Focus session is not active, so it can not be paused');
      }

      data.status = FocusSessionStatusEnum.PAUSED;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.PAUSED,
        createdAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.CONTINUE) {
      if (focusSession.status !== FocusSessionStatusEnum.PAUSED) {
        throw new Error('Focus session is not paused, so it can not be continued');
      }

      data.status = FocusSessionStatusEnum.ACTIVE;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.CONTINUED,
        createdAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.COMPLETE) {
      data.status = FocusSessionStatusEnum.PAUSED;
      data.completedAt = now;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.COMPLETED,
        createdAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.SKIP) {
      data.status = FocusSessionStatusEnum.PAUSED;

      if (currentFocusSessionStage === FocusSessionStageEnum.FOCUS) {
        data.stage = focusSessionHasDoneAllIterations
          ? FocusSessionStageEnum.LONG_BREAK
          : FocusSessionStageEnum.SHORT_BREAK;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.SHORT_BREAK) {
        data.stage = FocusSessionStageEnum.FOCUS;
        data.stageIteration = currentFocusSessionStageIteration + 1;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.LONG_BREAK) {
        data.completedAt = now;
      }

      focusSessionStageProgressSeconds = 0;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.SKIPPED,
        createdAt: nowString,
      });
    }

    // Stage over and underflow validation
    data.stageProgressSeconds = focusSessionStageProgressSeconds;
    if (data.stageProgressSeconds < 0) {
      data.stageProgressSeconds = 0;
    } else if (data.stageProgressSeconds > focusSessionStageDurationSeconds) {
      data.stageProgressSeconds = 0;

      if (currentFocusSessionStatus === FocusSessionStatusEnum.ACTIVE) {
        data.status = FocusSessionStatusEnum.PAUSED;
      }

      if (currentFocusSessionStage === FocusSessionStageEnum.FOCUS) {
        data.stage = focusSessionHasDoneAllIterations
          ? FocusSessionStageEnum.LONG_BREAK
          : FocusSessionStageEnum.SHORT_BREAK;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.SHORT_BREAK) {
        data.stage = FocusSessionStageEnum.FOCUS;
        data.stageIteration = currentFocusSessionStageIteration + 1;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.LONG_BREAK) {
        data.completedAt = now;
      }
    }

    data.events = currentFocusSessionEvents;
    data.lastPingedAt = now;

    const updatedFocusSession = await this.updateOneById(focusSession.id, data);

    globalEventsNotifier.publish(GlobalEventsEnum.FOCUS_FOCUS_SESSION_ACTION_TRIGGERED, {
      actorUserId: userId,
      focusSessionId: updatedFocusSession.id,
      action,
    });

    if (data.completedAt) {
      globalEventsNotifier.publish(GlobalEventsEnum.FOCUS_FOCUS_SESSION_COMPLETED, {
        actorUserId: userId,
        focusSessionId: updatedFocusSession.id,
      });
    }

    return updatedFocusSession;
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(focusSessions.id).mapWith(Number),
      })
      .from(focusSessions)
      .where(and(eq(focusSessions.userId, userId), isNull(focusSessions.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }
}

export const focusSessionsManager = new FocusSessionsManager();
