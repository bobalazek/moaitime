import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import {
  and,
  asc,
  between,
  count,
  desc,
  eq,
  inArray,
  isNotNull,
  isNull,
  lte,
  sql,
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
  addDateTimezoneToItself,
  CreateHabit,
  DayOfWeek,
  GlobalEventsEnum,
  HabitDaily,
  HabitGoalFrequencyEnum,
  UpdateHabit,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export type HabitsManagerListOptions = {
  search?: string;
  includeDeleted?: boolean;
};

export class HabitsManager {
  // API Helpers
  async list(actorUserId: string, options?: HabitsManagerListOptions) {
    return this.findManyByUserId(actorUserId, options);
  }

  async listDeleted(actorUserId: string) {
    return this.findManyDeletedByUserId(actorUserId);
  }

  async daily(actorUser: User, date: string): Promise<HabitDaily[]> {
    const dateObject = new Date(date);
    const { generalStartDayOfWeek } = usersManager.getUserSettings(actorUser);

    const where = and(
      eq(habits.userId, actorUser.id),
      isNull(habits.deletedAt),
      lte(habits.createdAt, endOfDay(dateObject)) // Only show habits that were created before the end of the day on that day
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

    const dailyHabitAmountMap = await this.getDailyHabitAmountsMap(
      allHabits,
      dateObject,
      generalStartDayOfWeek
    );
    const dailyHabitStreakMap = await this.getDailyHabitStreaksMap(
      allHabits,
      dateObject,
      generalStartDayOfWeek
    );

    return allHabits.map((habit) => {
      const amount = dailyHabitAmountMap.get(habit.id) ?? 0;
      let goalProgressPercentage = amount === 0 ? 0 : (amount / habit.goalAmount) * 100;
      if (goalProgressPercentage > 100) {
        goalProgressPercentage = 100;
      }

      const streak = dailyHabitStreakMap.get(habit.id) ?? 0;

      return {
        id: `${habit.id}-${date}`,
        date,
        amount,
        streak,
        goalProgressPercentage,
        intervalProgressPercentage: this.getIntervalProgressPercentage(
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
    const now = new Date();
    const endOfToday = endOfDay(now);

    const loggedAt = new Date(date);
    const startOfDayDate = startOfDay(loggedAt);
    const endOfDayDate = endOfDay(loggedAt);

    if (loggedAt > endOfToday) {
      throw new Error('Cannot update habit entry for future dates');
    }

    const habit = await this.view(actorUser.id, habitId);
    const createdAtStartOfDay = startOfDay(habit.createdAt!);
    if (loggedAt < createdAtStartOfDay) {
      throw new Error('Cannot update habit entry for dates before the habit was created');
    }

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

    const maxOrder = await this.getMaxOrderForUserId(actorUser.id);
    const order = maxOrder + 1;

    const habit = await this.insertOne({
      ...data,
      order,
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

  async reorder(
    actorUserId: string,
    options: {
      originalHabitId: string;
      newHabitId: string;
    }
  ) {
    const { originalHabitId, newHabitId } = options;

    await this.reorderHabits(actorUserId, originalHabitId, newHabitId);

    globalEventsNotifier.publish(GlobalEventsEnum.HABITS_REORDERED, {
      actorUserId: actorUserId,
    });
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

  // Helpers
  async findManyByUserId(userId: string, options?: HabitsManagerListOptions): Promise<Habit[]> {
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

  // Need for unit tests
  async findOneByUserIdAndName(userId: string, name: string): Promise<Habit | null> {
    const row = await getDatabase().query.habits.findFirst({
      where: and(eq(habits.userId, userId), eq(habits.name, name)),
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

  async reorderHabits(userId: string, originalHabitId: string, newHabitId: string) {
    const result = await this.findManyByUserId(userId, {
      includeDeleted: true,
    });

    const originalIndex = result.findIndex((entry) => entry.id === originalHabitId);
    const newIndex = result.findIndex((entry) => entry.id === newHabitId);
    if (originalIndex === -1 || newIndex === -1) {
      throw new Error('Habit not found.');
    }

    const [movedEntry] = result.splice(originalIndex, 1);
    result.splice(newIndex, 0, movedEntry);

    const reorderMap: Record<string, number> = {};
    result.forEach((entry, index) => {
      reorderMap[entry.id] = index;
    });

    await getDatabase().transaction(async (tx) => {
      for (const entryId in reorderMap) {
        await tx.update(habits).set({ order: reorderMap[entryId] }).where(eq(habits.id, entryId));
      }
    });
  }

  async getMaxOrderForUserId(userId: string): Promise<number> {
    const rows = await getDatabase()
      .select()
      .from(habits)
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.order))
      .limit(1)
      .execute();

    if (rows.length === 0) {
      return 0;
    }

    return rows[0].order ?? 0;
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

  async getDailyHabitAmountsMap(
    habits: Habit[],
    date: Date,
    generalStartDayOfWeek: DayOfWeek
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();

    // Daily
    const dailyHabitIds = habits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.DAY;
      })
      .map((habit) => habit.id);
    if (dailyHabitIds.length > 0) {
      const startOfDayDate = startOfDay(date);
      const endOfDayDate = endOfDay(date);
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
        map.set(entry.habitId, entry.sum ?? 0);
      }
    }

    // Weekly
    const weeklyHabitIds = habits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.WEEK;
      })
      .map((habit) => habit.id);
    if (weeklyHabitIds.length > 0) {
      const startOfWeekDate = startOfWeek(date, {
        weekStartsOn: generalStartDayOfWeek,
      });
      const endOfWeekDate = endOfWeek(date, {
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
        map.set(entry.habitId, entry.sum ?? 0);
      }
    }

    // Monthly
    const monthlyHabitIds = habits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.MONTH;
      })
      .map((habit) => habit.id);
    if (monthlyHabitIds.length > 0) {
      const startOfMonthDate = startOfMonth(date);
      const endOfMonthDate = endOfMonth(date);
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
        map.set(entry.habitId, entry.sum ?? 0);
      }
    }

    // Yearly
    const yearlyHabitIds = habits
      .filter((habit) => {
        return habit.goalFrequency === HabitGoalFrequencyEnum.YEAR;
      })
      .map((habit) => habit.id);
    if (yearlyHabitIds.length > 0) {
      const startOfYearDate = startOfYear(date);
      const endOfYearDate = endOfYear(date);
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
        map.set(entry.habitId, entry.sum ?? 0);
      }
    }

    return map;
  }

  async getDailyHabitStreaksMap(
    habits: Habit[],
    selectedDate: Date,
    generalStartDayOfWeek: DayOfWeek
  ): Promise<Map<string, number>> {
    const map = new Map<string, number>();

    const loggedAtDate = sql<string>`DATE(${habitEntries.loggedAt})`;

    // For now, we only want to show the streak for the current day
    const now = new Date();
    const todayDateString = format(now, 'yyyy-MM-dd'); // TODO: we need to consider the timezone here!
    const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
    if (todayDateString !== selectedDateString) {
      return map;
    }

    const habitsMap = new Map<string, Habit>();
    for (const habit of habits) {
      habitsMap.set(habit.id, habit);
    }

    const habitIds = habits.map((habit) => habit.id);
    const habitEntriesPerDay = await getDatabase()
      .select({
        habitId: habitEntries.habitId,
        sum: sum(habitEntries.amount).mapWith(Number),
        date: loggedAtDate,
      })
      .from(habitEntries)
      .where(inArray(habitEntries.habitId, habitIds))
      .groupBy(habitEntries.habitId, habitEntries.loggedAt)
      .orderBy(desc(habitEntries.loggedAt))
      .execute();

    // { habitId =>  { periodStartDate => sum } }
    const habitEntriesPerPeriod = new Map<string, Map<string, number>>();
    for (const entry of habitEntriesPerDay) {
      const habit = habitsMap.get(entry.habitId);
      if (!habit) {
        continue;
      }

      const existingEntriesMap =
        habitEntriesPerPeriod.get(entry.habitId) ?? new Map<string, number>();

      const { start } = this._getPeriodStartAndEnd(
        entry.date,
        habit.goalFrequency,
        generalStartDayOfWeek
      );

      const periodStartDate = format(start, 'yyyy-MM-dd');
      const sum = existingEntriesMap.get(periodStartDate) ?? 0;
      existingEntriesMap.set(periodStartDate, sum + entry.sum);

      habitEntriesPerPeriod.set(entry.habitId, existingEntriesMap);
    }

    for (const [habitId, entriesMap] of habitEntriesPerPeriod) {
      const habit = habitsMap.get(habitId);
      if (!habit) {
        continue;
      }

      let streak = 0;

      const firstEntryNewestDateString = Array.from(entriesMap.keys())[0];
      const isFirstPeriodInCurrentRange = this._checkIfIsIntRange(
        selectedDateString,
        firstEntryNewestDateString,
        habit.goalFrequency,
        generalStartDayOfWeek
      );
      const periodPreviousDate = this._getPreviousPeriodStartDate(
        firstEntryNewestDateString,
        habit.goalFrequency
      );
      const periodPreviousDateString = format(periodPreviousDate, 'yyyy-MM-dd');
      const isFirstPeriodInPreviousRange = this._checkIfIsIntRange(
        selectedDateString,
        periodPreviousDateString,
        habit.goalFrequency,
        generalStartDayOfWeek
      );

      if (!isFirstPeriodInCurrentRange && !isFirstPeriodInPreviousRange) {
        continue;
      }

      for (const [periodStartDateString, sum] of entriesMap) {
        const nextPeriodStartDate = this._getPreviousPeriodStartDate(
          periodStartDateString,
          habit.goalFrequency
        );
        const nextPeriodStartDateString = format(nextPeriodStartDate, 'yyyy-MM-dd');
        const nextPeriodExists = entriesMap.has(nextPeriodStartDateString);

        if (sum >= habit.goalAmount) {
          streak++;

          if (!nextPeriodExists) {
            break;
          }
        } else {
          break;
        }
      }

      map.set(habitId, streak);
    }

    return map;
  }

  getIntervalProgressPercentage(date: Date, habit: Habit, user: User) {
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

  private _getPeriodStartAndEnd(
    selectedDateString: string,
    frequency: HabitGoalFrequencyEnum,
    generalStartDayOfWeek: DayOfWeek
  ) {
    const selectedDate = new Date(selectedDateString);
    let start: Date;
    let end: Date;

    if (frequency === HabitGoalFrequencyEnum.WEEK) {
      start = startOfWeek(selectedDate, {
        weekStartsOn: generalStartDayOfWeek,
      });
      end = endOfWeek(selectedDate, {
        weekStartsOn: generalStartDayOfWeek,
      });
    } else if (frequency === HabitGoalFrequencyEnum.MONTH) {
      start = startOfMonth(selectedDate);
      end = endOfMonth(selectedDate);
    } else if (frequency === HabitGoalFrequencyEnum.YEAR) {
      start = startOfYear(selectedDate);
      end = endOfYear(selectedDate);
    } else {
      start = startOfDay(selectedDate);
      end = endOfDay(selectedDate);
    }

    return {
      start: addDateTimezoneToItself(start),
      end: addDateTimezoneToItself(end),
    };
  }

  private _getPreviousPeriodStartDate(
    selectedDateString: string,
    frequency: HabitGoalFrequencyEnum
  ) {
    let selectedDate: Date;
    if (frequency === HabitGoalFrequencyEnum.WEEK) {
      selectedDate = new Date(subWeeks(new Date(selectedDateString), 1));
    } else if (frequency === HabitGoalFrequencyEnum.MONTH) {
      selectedDate = new Date(subMonths(new Date(selectedDateString), 1));
    } else if (frequency === HabitGoalFrequencyEnum.YEAR) {
      selectedDate = new Date(subYears(new Date(selectedDateString), 1));
    } else {
      selectedDate = new Date(subDays(new Date(selectedDateString), 1));
    }

    return selectedDate;
  }

  private _checkIfIsIntRange(
    selectedDateString: string,
    entryDateString: string,
    frequency: HabitGoalFrequencyEnum,
    generalStartDayOfWeek: DayOfWeek
  ) {
    const { start, end } = this._getPeriodStartAndEnd(
      selectedDateString,
      frequency,
      generalStartDayOfWeek
    );

    const entryDate = new Date(entryDateString);

    return entryDate.getTime() >= start.getTime() && entryDate.getTime() <= end.getTime();
  }
}

export const habitsManager = new HabitsManager();
