import { and, count, DBQueryConfig, desc, eq, isNull } from 'drizzle-orm';

import { FocusSession, focusSessions, getDatabase, NewFocusSession } from '@moaitime/database-core';
import {
  FocusSessionEventTypeEnum,
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  getFocusSessionDurationForCurrentStage,
  getTimeDifferenceInSeconds,
} from '@moaitime/shared-common';

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

  // Helpers
  async userCanView(userId: string, focusSessionId: string): Promise<boolean> {
    const row = await getDatabase().query.focusSessions.findFirst({
      where: and(eq(focusSessions.id, focusSessionId), eq(focusSessions.userId, userId)),
    });

    return row !== null;
  }

  async userCanUpdate(userId: string, focusSessionId: string): Promise<boolean> {
    return this.userCanView(userId, focusSessionId);
  }

  async userCanDelete(userId: string, focusSessionId: string): Promise<boolean> {
    return this.userCanUpdate(userId, focusSessionId);
  }

  async update(
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
    const updateData: Partial<NewFocusSession> = {};

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

      updateData.status = FocusSessionStatusEnum.PAUSED;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.PAUSED,
        createdAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.CONTINUE) {
      if (focusSession.status !== FocusSessionStatusEnum.PAUSED) {
        throw new Error('Focus session is not paused, so it can not be continued');
      }

      updateData.status = FocusSessionStatusEnum.ACTIVE;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.CONTINUED,
        createdAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.COMPLETE) {
      updateData.status = FocusSessionStatusEnum.PAUSED;
      updateData.completedAt = now;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.COMPLETED,
        createdAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.SKIP) {
      updateData.status = FocusSessionStatusEnum.PAUSED;

      if (currentFocusSessionStage === FocusSessionStageEnum.FOCUS) {
        updateData.stage = focusSessionHasDoneAllIterations
          ? FocusSessionStageEnum.LONG_BREAK
          : FocusSessionStageEnum.SHORT_BREAK;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.SHORT_BREAK) {
        updateData.stage = FocusSessionStageEnum.FOCUS;
        updateData.stageIteration = currentFocusSessionStageIteration + 1;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.LONG_BREAK) {
        updateData.completedAt = now;
      }

      focusSessionStageProgressSeconds = 0;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.SKIPPED,
        createdAt: nowString,
      });
    }

    // Stage over and underflow validation
    updateData.stageProgressSeconds = focusSessionStageProgressSeconds;
    if (updateData.stageProgressSeconds < 0) {
      updateData.stageProgressSeconds = 0;
    } else if (updateData.stageProgressSeconds > focusSessionStageDurationSeconds) {
      updateData.stageProgressSeconds = 0;

      if (currentFocusSessionStatus === FocusSessionStatusEnum.ACTIVE) {
        updateData.status = FocusSessionStatusEnum.PAUSED;
      }

      if (currentFocusSessionStage === FocusSessionStageEnum.FOCUS) {
        updateData.stage = focusSessionHasDoneAllIterations
          ? FocusSessionStageEnum.LONG_BREAK
          : FocusSessionStageEnum.SHORT_BREAK;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.SHORT_BREAK) {
        updateData.stage = FocusSessionStageEnum.FOCUS;
        updateData.stageIteration = currentFocusSessionStageIteration + 1;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.LONG_BREAK) {
        updateData.completedAt = now;
      }
    }

    updateData.events = currentFocusSessionEvents;
    updateData.lastPingedAt = now;

    return this.updateOneById(focusSession.id, updateData);
  }

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
