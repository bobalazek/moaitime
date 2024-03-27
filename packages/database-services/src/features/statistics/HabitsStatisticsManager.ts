import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { getDatabase, habits, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsDateCountData,
  StatisticsHabitsBasicData,
} from '@moaitime/shared-common';

export class HabitsStatisticsManager {
  // Helpers
  async getBasics(user: User): Promise<StatisticsHabitsBasicData> {
    let habitsCreatedTodayCount = 0;
    let habitsCreatedYesterdayCount = 0;
    let habitsCreatedThisWeekCount = 0;
    let habitsCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getHabitsCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        habitsCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        habitsCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        habitsCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        habitsCreatedThisMonthCount += count;
      }
    }

    return {
      habitsCreatedTodayCount,
      habitsCreatedYesterdayCount,
      habitsCreatedThisWeekCount,
      habitsCreatedThisMonthCount,
    };
  }

  async getHabitsCreated(user: User, from?: Date, to?: Date): Promise<StatisticsDateCountData> {
    let where = eq(habits.userId, user.id);

    if (from && to) {
      where = and(where, between(habits.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(habits.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(habits.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<string>`DATE(${habits.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(habits).mapWith(Number) })
      .from(habits)
      .where(where)
      .groupBy(createdAtDate)
      .execute();

    const result: StatisticsDateCountData = {};
    for (const row of rows) {
      result[format(new Date(row.date), 'yyyy-MM-dd')] = row.count;
    }

    if (from && to) {
      return padDataForRangeMap(result, from, to);
    }

    return result;
  }
}

export const habitsStatisticsManager = new HabitsStatisticsManager();
