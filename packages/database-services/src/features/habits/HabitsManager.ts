import { endOfDay } from 'date-fns';
import { and, asc, count, DBQueryConfig, desc, eq, inArray, isNull, lte, SQL } from 'drizzle-orm';

import {
  getDatabase,
  Habit,
  habitDailyEntries,
  habits,
  NewHabit,
  User,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { CreateHabit, GlobalEventsEnum, HabitDaily, UpdateHabit } from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export type HabitsManagerFindManyByUserIdWithOptions = {
  search?: string;
  includeDeleted?: boolean;
};

export class HabitsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Habit[]> {
    return getDatabase().query.habits.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Habit[]> {
    return getDatabase().query.habits.findMany({
      where: and(eq(habits.userId, userId), isNull(habits.deletedAt)),
      orderBy: desc(habits.createdAt),
    });
  }

  async findManyByUserIdWithOptions(
    userId: string,
    options?: HabitsManagerFindManyByUserIdWithOptions
  ): Promise<Habit[]> {
    let where = eq(habits.userId, userId);

    if (!options?.includeDeleted) {
      where = and(where, isNull(habits.deletedAt)) as SQL<unknown>;
    }

    return getDatabase().query.habits.findMany({
      where,
    });
  }

  async findOneById(habitId: string): Promise<Habit | null> {
    const row = await getDatabase().query.habits.findFirst({
      where: eq(habits.id, habitId),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(habitId: string, userId: string): Promise<Habit | null> {
    const row = await getDatabase().query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
    });

    return row ?? null;
  }

  async insertOne(data: NewHabit): Promise<Habit> {
    const rows = await getDatabase().insert(habits).values(data).returning();

    return rows[0];
  }

  async updateOneById(habitId: string, data: Partial<NewHabit>): Promise<Habit> {
    const rows = await getDatabase()
      .update(habits)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(habits.id, habitId))
      .returning();

    return rows[0];
  }

  async deleteOneById(habitId: string): Promise<Habit> {
    const rows = await getDatabase().delete(habits).where(eq(habits.id, habitId)).returning();

    return rows[0];
  }

  // Permissions
  async userCanView(userId: string, habitId: string): Promise<boolean> {
    const row = await getDatabase().query.habits.findFirst({
      where: and(eq(habits.id, habitId), eq(habits.userId, userId)),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, habitId: string): Promise<boolean> {
    return this.userCanView(userId, habitId);
  }

  async userCanDelete(userId: string, habitId: string): Promise<boolean> {
    return this.userCanUpdate(userId, habitId);
  }

  // API Helpers
  async list(actorUserId: string, options?: HabitsManagerFindManyByUserIdWithOptions) {
    return this.findManyByUserIdWithOptions(actorUserId, options);
  }

  async daily(actorUserId: string, date: string): Promise<HabitDaily[]> {
    const dateObject = endOfDay(new Date(date));
    const where = and(
      eq(habits.userId, actorUserId),
      isNull(habits.deletedAt),
      lte(habits.createdAt, dateObject)
    );

    const dailyHabits = await getDatabase()
      .select()
      .from(habits)
      .where(where)
      .orderBy(asc(habits.order))
      .execute();

    if (dailyHabits.length === 0) {
      return [];
    }

    const habitIds = dailyHabits.map((habit) => habit.id);

    const dailyEntries = await getDatabase().query.habitDailyEntries.findMany({
      where: and(inArray(habitDailyEntries.habitId, habitIds), eq(habitDailyEntries.date, date)),
    });

    const dailyEntriesMap = new Map<string, number>();
    for (const entry of dailyEntries) {
      dailyEntriesMap.set(entry.habitId, entry.amount);
    }

    return dailyHabits.map((habit) => ({
      id: `${habit.id}-${date}`,
      date,
      amount: dailyEntriesMap.get(habit.id) ?? 0,
      habit: {
        ...habit,
        order: habit.order ?? 0,
        deletedAt: habit.deletedAt?.toISOString() ?? null,
        createdAt: habit.createdAt!.toISOString(),
        updatedAt: habit.updatedAt!.toISOString(),
      },
    }));
  }

  async view(actorUserId: string, habitId: string) {
    const canView = await this.userCanView(actorUserId, habitId);
    if (!canView) {
      throw new Error('You cannot view this habit');
    }

    const data = await this.findOneByIdAndUserId(habitId, actorUserId);
    if (!data) {
      throw new Error('Habit not found');
    }

    return data;
  }

  async dailyUpdate(actorUserId: string, habitId: string, date: string, amount: number) {
    await this.view(actorUserId, habitId);

    const dailyEntry = await getDatabase().query.habitDailyEntries.findFirst({
      where: and(eq(habitDailyEntries.habitId, habitId), eq(habitDailyEntries.date, date)),
    });
    if (dailyEntry) {
      const rows = await getDatabase()
        .update(habitDailyEntries)
        .set({ amount, updatedAt: new Date() })
        .where(eq(habitDailyEntries.id, dailyEntry.id))
        .returning();
      const row = rows[0] ?? null;
      if (!row) {
        throw new Error('Failed to update daily entry');
      }

      return row;
    }

    const rows = await getDatabase()
      .insert(habitDailyEntries)
      .values({
        habitId,
        date,
        amount,
      })
      .returning();
    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to create daily entry');
    }

    return row;
  }

  async create(actorUser: User, data: CreateHabit) {
    const habitsMaxPerUserCount = await usersManager.getUserLimit(
      actorUser,
      'habitsMaxPerUserCount'
    );

    const habitsCount = await this.countByUserId(actorUser.id);
    if (habitsCount >= habitsMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of habits per user (${habitsMaxPerUserCount}).`
      );
    }

    const habit = await this.insertOne({
      ...data,
      userId: actorUser.id,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.HABITS_HABIT_ADDED, {
      actorUserId: actorUser.id,
      habitId: habit.id,
    });

    return habit;
  }

  async update(actorUserId: string, habitId: string, data: UpdateHabit) {
    const canView = await this.userCanUpdate(actorUserId, habitId);
    if (!canView) {
      throw new Error('You cannot update this habit');
    }

    const habit = await this.findOneById(habitId);
    if (!habit) {
      throw new Error('Habit not found');
    }

    const updatedHabit = await this.updateOneById(habitId, data);

    globalEventsNotifier.publish(GlobalEventsEnum.HABITS_HABIT_EDITED, {
      actorUserId,
      habitId: updatedHabit.id,
    });

    return updatedHabit;
  }

  async delete(actorUserId: string, habitId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(actorUserId, habitId);
    if (!canDelete) {
      throw new Error('Habit not found');
    }

    const deletedHabit = isHardDelete
      ? await this.deleteOneById(habitId)
      : await this.updateOneById(habitId, {
          deletedAt: new Date(),
        });

    globalEventsNotifier.publish(GlobalEventsEnum.HABITS_HABIT_DELETED, {
      actorUserId,
      habitId: deletedHabit.id,
    });

    return deletedHabit;
  }

  async undelete(actorUserId: string, habitId: string) {
    const canDelete = await habitsManager.userCanUpdate(actorUserId, habitId);
    if (!canDelete) {
      throw new Error('You cannot undelete this habit');
    }

    const undeletedHabit = await habitsManager.updateOneById(habitId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.HABITS_HABIT_DELETED, {
      actorUserId,
      habitId: undeletedHabit.id,
    });

    return undeletedHabit;
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(habits.id).mapWith(Number),
      })
      .from(habits)
      .where(and(eq(habits.userId, userId), isNull(habits.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }
}

export const habitsManager = new HabitsManager();
