import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  and,
  asc,
  between,
  count,
  DBQueryConfig,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  lte,
  SQL,
  sum,
} from 'drizzle-orm';

import {
  getDatabase,
  Habit,
  habitEntries,
  HabitEntry,
  habits,
  NewHabit,
  User,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  CreateHabit,
  GlobalEventsEnum,
  HabitDaily,
  HabitGoalFrequencyEnum,
  UpdateHabit,
} from '@moaitime/shared-common';

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

  async findManyDeletedByUserId(userId: string): Promise<Habit[]> {
    return getDatabase().query.habits.findMany({
      where: and(eq(habits.userId, userId), isNotNull(habits.deletedAt)),
      orderBy: desc(habits.createdAt),
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

  async listDeleted(actorUserId: string) {
    return this.findManyDeletedByUserId(actorUserId);
  }

  async daily(actorUser: User, date: string): Promise<HabitDaily[]> {
    const dateObject = new Date(date);
    const endOfDayDate = endOfDay(dateObject);
    const { generalStartDayOfWeek } = usersManager.getUserSettings(actorUser);

    const where = and(
      eq(habits.userId, actorUser.id),
      isNull(habits.deletedAt),
      lte(habits.createdAt, endOfDayDate)
    );
    const allHabits = await getDatabase()
      .select()
      .from(habits)
      .where(where)
      .orderBy(asc(habits.order))
      .execute();
    if (allHabits.length === 0) {
      return [];
    }

    const entriesMap = new Map<string, number>();

    // Daily
    const dailyHabitIds = allHabits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.DAY;
      })
      .map((habit) => habit.id);
    if (dailyHabitIds.length > 0) {
      const startOfDayDate = startOfDay(dateObject);
      const dailyHabitEntries = await getDatabase()
        .select({
          habitId: habitEntries.habitId,
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            inArray(habitEntries.habitId, dailyHabitIds),
            between(habitEntries.loggedAt, startOfDayDate, endOfDayDate)
          )
        )
        .groupBy(habitEntries.habitId)
        .execute();

      for (const entry of dailyHabitEntries) {
        entriesMap.set(entry.habitId, entry.sum ?? 0);
      }
    }

    // Weekly
    const weeklyHabitIds = allHabits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.WEEK;
      })
      .map((habit) => habit.id);
    if (weeklyHabitIds.length > 0) {
      const startOfWeekDate = startOfWeek(dateObject, {
        weekStartsOn: generalStartDayOfWeek,
      });
      const endOfWeekDate = endOfWeek(dateObject, {
        weekStartsOn: generalStartDayOfWeek,
      });
      const weeklyHabitEntries = await getDatabase()
        .select({
          habitId: habitEntries.habitId,
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            inArray(habitEntries.habitId, weeklyHabitIds),
            between(habitEntries.loggedAt, startOfWeekDate, endOfWeekDate)
          )
        )
        .groupBy(habitEntries.habitId)
        .execute();

      for (const entry of weeklyHabitEntries) {
        entriesMap.set(entry.habitId, entry.sum ?? 0);
      }
    }

    // Monthly
    const monthlyHabitIds = allHabits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.MONTH;
      })
      .map((habit) => habit.id);
    if (monthlyHabitIds.length > 0) {
      const startOfMonthDate = startOfMonth(dateObject);
      const endOfMonthDate = endOfMonth(dateObject);
      const monthlyHabitEntries = await getDatabase()
        .select({
          habitId: habitEntries.habitId,
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            inArray(habitEntries.habitId, monthlyHabitIds),
            between(habitEntries.loggedAt, startOfMonthDate, endOfMonthDate)
          )
        )
        .groupBy(habitEntries.habitId)
        .execute();

      for (const entry of monthlyHabitEntries) {
        entriesMap.set(entry.habitId, entry.sum ?? 0);
      }
    }

    // Yearly
    const yearlyHabitIds = allHabits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.YEAR;
      })
      .map((habit) => habit.id);
    if (yearlyHabitIds.length > 0) {
      const startOfYearDate = startOfYear(dateObject);
      const endOfYearDate = endOfYear(dateObject);
      const yearlyHabitEntries = await getDatabase()
        .select({
          habitId: habitEntries.habitId,
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            inArray(habitEntries.habitId, yearlyHabitIds),
            between(habitEntries.loggedAt, startOfYearDate, endOfYearDate)
          )
        )
        .groupBy(habitEntries.habitId)
        .execute();

      for (const entry of yearlyHabitEntries) {
        entriesMap.set(entry.habitId, entry.sum ?? 0);
      }
    }

    return allHabits.map((habit) => {
      const amount = entriesMap.get(habit.id) ?? 0;
      let goalProgressPercentage = amount === 0 ? 0 : (amount / habit.goalAmount) * 100;
      if (goalProgressPercentage > 100) {
        goalProgressPercentage = 100;
      }

      return {
        id: `${habit.id}-${date}`,
        date,
        amount,
        goalProgressPercentage,
        intervalProgressPercentage: this._getIntervalProgressPercentage(
          dateObject,
          habit,
          actorUser
        ),
        habit: {
          ...habit,
          order: habit.order ?? 0,
          deletedAt: habit.deletedAt?.toISOString() ?? null,
          createdAt: habit.createdAt!.toISOString(),
          updatedAt: habit.updatedAt!.toISOString(),
        },
      };
    });
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

  async dailyUpdate(actorUser: User, habitId: string, date: string, newAmount: number) {
    const habit = await this.view(actorUser.id, habitId);

    const loggedAt = new Date(date);
    const startOfDayDate = startOfDay(loggedAt);
    const endOfDayDate = endOfDay(loggedAt);

    const habitEntry = await getDatabase().query.habitEntries.findFirst({
      where: and(
        eq(habitEntries.habitId, habitId),
        between(habitEntries.loggedAt, startOfDayDate, endOfDayDate)
      ),
    });

    if (habit.goalFrequency === HabitGoalFrequencyEnum.WEEK) {
      const { generalStartDayOfWeek } = usersManager.getUserSettings(actorUser);
      const startOfWeekDate = startOfWeek(loggedAt, {
        weekStartsOn: generalStartDayOfWeek,
      });
      const endOfWeekDate = endOfWeek(loggedAt, {
        weekStartsOn: generalStartDayOfWeek,
      });
      const currentWeeklyResult = await getDatabase()
        .select({
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            eq(habitEntries.habitId, habitId),
            between(habitEntries.loggedAt, startOfWeekDate, endOfWeekDate)
          )
        )
        .execute();

      const sumResult = currentWeeklyResult[0].sum ?? 0;
      const targetAmountDelta = newAmount - sumResult;
      if (habitEntry) {
        return this.updateHabitEntry(habitEntry, habitEntry.amount + targetAmountDelta);
      } else {
        return this.createHabitEntry(habitId, loggedAt, targetAmountDelta);
      }
    } else if (habit.goalFrequency === HabitGoalFrequencyEnum.MONTH) {
      const startOfMonthDate = startOfMonth(loggedAt);
      const endOfMonthDate = endOfMonth(loggedAt);
      const currentMonthlyResult = await getDatabase()
        .select({
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            eq(habitEntries.habitId, habitId),
            between(habitEntries.loggedAt, startOfMonthDate, endOfMonthDate)
          )
        )
        .execute();

      const sumResult = currentMonthlyResult[0].sum ?? 0;
      const targetAmountDelta = newAmount - sumResult;
      if (habitEntry) {
        return this.updateHabitEntry(habitEntry, habitEntry.amount + targetAmountDelta);
      } else {
        return this.createHabitEntry(habitId, loggedAt, targetAmountDelta);
      }
    } else if (habit.goalFrequency === HabitGoalFrequencyEnum.YEAR) {
      const startOfYearDate = startOfYear(loggedAt);
      const endOfYearDate = endOfYear(loggedAt);
      const currentYearlyResult = await getDatabase()
        .select({
          sum: sum(habitEntries.amount).mapWith(Number),
        })
        .from(habitEntries)
        .where(
          and(
            eq(habitEntries.habitId, habitId),
            between(habitEntries.loggedAt, startOfYearDate, endOfYearDate)
          )
        )
        .execute();

      const sumResult = currentYearlyResult[0].sum ?? 0;
      const targetAmountDelta = newAmount - sumResult;
      if (habitEntry) {
        return this.updateHabitEntry(habitEntry, habitEntry.amount + targetAmountDelta);
      } else {
        return this.createHabitEntry(habitId, loggedAt, targetAmountDelta);
      }
    }

    // Daily
    if (habitEntry) {
      return this.updateHabitEntry(habitEntry, newAmount);
    }

    return this.createHabitEntry(habitId, loggedAt, newAmount);
  }

  async create(actorUser: User, data: CreateHabit) {
    await this._checkIfLimitReached(actorUser);

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

  async undelete(actorUser: User, habitId: string) {
    const canDelete = await habitsManager.userCanUpdate(actorUser.id, habitId);
    if (!canDelete) {
      throw new Error('You cannot undelete this habit');
    }

    await this._checkIfLimitReached(actorUser);

    const undeletedHabit = await habitsManager.updateOneById(habitId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.HABITS_HABIT_DELETED, {
      actorUserId: actorUser.id,
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

  async updateHabitEntry(habitEntry: HabitEntry, amount: number) {
    const rows = await getDatabase()
      .update(habitEntries)
      .set({ amount, updatedAt: new Date() })
      .where(eq(habitEntries.id, habitEntry.id))
      .returning();
    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to update habit entry');
    }

    return row;
  }

  async createHabitEntry(habitId: string, loggedAt: Date, amount: number) {
    const rows = await getDatabase()
      .insert(habitEntries)
      .values({
        habitId,
        loggedAt,
        amount,
      })
      .returning();
    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to create habit entry');
    }

    return row;
  }

  // Private
  private async _checkIfLimitReached(actorUser: User) {
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
  }

  private _getIntervalProgressPercentage(date: Date, habit: Habit, user: User) {
    const { generalStartDayOfWeek, generalTimezone } = usersManager.getUserSettings(user);

    const now = utcToZonedTime(new Date(), generalTimezone);
    let intervalProgressPercentage = 0;

    if (habit.goalFrequency === HabitGoalFrequencyEnum.DAY) {
      const endOfDayDate = endOfDay(date);
      if (now.getTime() > endOfDayDate.getTime()) {
        intervalProgressPercentage = 100;
      } else {
        intervalProgressPercentage =
          ((now.getTime() - date.getTime()) / (endOfDayDate.getTime() - date.getTime())) * 100;
      }
    } else if (habit.goalFrequency === HabitGoalFrequencyEnum.WEEK) {
      const startOfWeekDate = startOfWeek(date, {
        weekStartsOn: generalStartDayOfWeek,
      });
      const endOfWeekDate = endOfWeek(date, {
        weekStartsOn: generalStartDayOfWeek,
      });
      if (now.getTime() > endOfWeekDate.getTime()) {
        intervalProgressPercentage = 100;
      } else {
        intervalProgressPercentage =
          ((now.getTime() - startOfWeekDate.getTime()) /
            (endOfWeekDate.getTime() - startOfWeekDate.getTime())) *
          100;
      }
    } else if (habit.goalFrequency === HabitGoalFrequencyEnum.MONTH) {
      const startOfMonthDate = startOfMonth(date);
      const endOfMonthDate = endOfMonth(date);
      if (now.getTime() > endOfMonthDate.getTime()) {
        intervalProgressPercentage = 100;
      } else {
        intervalProgressPercentage =
          ((now.getTime() - startOfMonthDate.getTime()) /
            (endOfMonthDate.getTime() - startOfMonthDate.getTime())) *
          100;
      }
    } else if (habit.goalFrequency === HabitGoalFrequencyEnum.YEAR) {
      const startOfYearDate = startOfYear(date);
      const endOfYearDate = endOfYear(date);
      if (now.getTime() > endOfYearDate.getTime()) {
        intervalProgressPercentage = 100;
      } else {
        intervalProgressPercentage =
          ((now.getTime() - startOfYearDate.getTime()) /
            (endOfYearDate.getTime() - startOfYearDate.getTime())) *
          100;
      }
    }

    return intervalProgressPercentage;
  }
}

export const habitsManager = new HabitsManager();
