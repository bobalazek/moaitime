import { and, count, DBQueryConfig, desc, eq, isNull, ne } from 'drizzle-orm';

import { FocusSession, focusSessions, getDatabase, NewFocusSession } from '@moaitime/database-core';
import {
  FocusSessionEventTypeEnum,
  FocusSessionStageEnum,
  FocusSessionStatusEnum,
  FocusSessionUpdateActionEnum,
  getFocusSessionDurationForCurrentStage,
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
        ne(focusSessions.status, FocusSessionStatusEnum.COMPLETED),
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

    const calculateTimeDifferenceInSeconds = (start: Date, end: Date) => {
      return Math.floor((start.getTime() - end.getTime()) / 1000);
    };

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

    let focusSessionStageProgressSeconds = focusSession.stageProgressSeconds ?? 0;

    if (action === FocusSessionUpdateActionEnum.PAUSE) {
      if (focusSession.status !== FocusSessionStatusEnum.ACTIVE) {
        throw new Error('Focus session is not active, so it can not be paused');
      }

      updateData.status = FocusSessionStatusEnum.PAUSED;

      // Calculate stage progress seconds before pausing
      if (currentFocusSessionEvents.length > 0) {
        const lastEvent = currentFocusSessionEvents[currentFocusSessionEvents.length - 1];
        if (lastEvent.type !== FocusSessionEventTypeEnum.PAUSED) {
          const additionalSeconds = lastEvent.startedAt
            ? calculateTimeDifferenceInSeconds(now, new Date(lastEvent.startedAt))
            : 0;
          focusSessionStageProgressSeconds += additionalSeconds;
        }
      } else {
        const additionalSeconds = calculateTimeDifferenceInSeconds(now, lastActiveAt);
        focusSessionStageProgressSeconds += additionalSeconds;
      }

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.PAUSED,
        startedAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.CONTINUE) {
      if (focusSession.status !== FocusSessionStatusEnum.PAUSED) {
        throw new Error('Focus session is not paused, so it can not be continued');
      }

      updateData.status = FocusSessionStatusEnum.ACTIVE;

      // Events
      const lastEvent = currentFocusSessionEvents[currentFocusSessionEvents.length - 1];
      if (lastEvent && lastEvent.type === FocusSessionEventTypeEnum.PAUSED) {
        lastEvent.endedAt = nowString;
        currentFocusSessionEvents[currentFocusSessionEvents.length - 1] = lastEvent;
      }

      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.CONTINUED,
        startedAt: nowString,
        endedAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.COMPLETE) {
      updateData.status = FocusSessionStatusEnum.COMPLETED;
      updateData.completedAt = now;

      // Calculate stage progress seconds before completing
      if (
        focusSession.status === FocusSessionStatusEnum.ACTIVE &&
        currentFocusSessionEvents.length > 0
      ) {
        const lastEvent = currentFocusSessionEvents[currentFocusSessionEvents.length - 1];
        if (lastEvent.type !== FocusSessionEventTypeEnum.PAUSED) {
          const lastEventStartedAt = lastEvent.startedAt ? new Date(lastEvent.startedAt) : now;
          const additionalSeconds = calculateTimeDifferenceInSeconds(lastEventStartedAt, now);
          focusSessionStageProgressSeconds += additionalSeconds;
        }
      }

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.COMPLETED,
        startedAt: nowString,
        endedAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.SKIP) {
      updateData.stageIteration = currentFocusSessionStageIteration + 1;

      // Events
      currentFocusSessionEvents.push({
        type: FocusSessionEventTypeEnum.SKIPPED,
        startedAt: nowString,
        endedAt: nowString,
      });
    } else if (action === FocusSessionUpdateActionEnum.PING) {
      if (focusSession.status === FocusSessionStatusEnum.ACTIVE) {
        const additionalActiveTime = calculateTimeDifferenceInSeconds(now, lastActiveAt);
        focusSessionStageProgressSeconds += additionalActiveTime;
      }
    }

    // Stage progress seconds validation
    updateData.stageProgressSeconds = focusSessionStageProgressSeconds;
    if (updateData.stageProgressSeconds < 0) {
      updateData.stageProgressSeconds = 0;
    } else if (
      focusSession.settings &&
      updateData.stageProgressSeconds > focusSessionStageDurationSeconds
    ) {
      updateData.stageProgressSeconds = focusSessionStageDurationSeconds;

      if (currentFocusSessionStatus === FocusSessionStatusEnum.ACTIVE) {
        updateData.status = FocusSessionStatusEnum.PAUSED;
      }

      if (
        currentFocusSessionStage === FocusSessionStageEnum.FOCUS &&
        focusSessionHasDoneAllIterations
      ) {
        updateData.stage = FocusSessionStageEnum.LONG_BREAK;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.FOCUS) {
        updateData.stage = FocusSessionStageEnum.SHORT_BREAK;
        updateData.stageIteration = currentFocusSessionStageIteration + 1;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.SHORT_BREAK) {
        updateData.stage = FocusSessionStageEnum.FOCUS;
        updateData.stageIteration = currentFocusSessionStageIteration + 1;
      } else if (currentFocusSessionStage === FocusSessionStageEnum.LONG_BREAK) {
        updateData.stage = FocusSessionStageEnum.FOCUS;
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
