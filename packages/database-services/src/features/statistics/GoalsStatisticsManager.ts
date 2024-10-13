import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { getDatabase, goals, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsDateCountData,
  StatisticsGoalsBasicData,
} from '@moaitime/shared-common';

export class GoalsStatisticsManager {
  // Helpers
  async getBasics(user: User): Promise<StatisticsGoalsBasicData> {
    let goalsCreatedTodayCount = 0;
    let goalsCreatedYesterdayCount = 0;
    let goalsCreatedThisWeekCount = 0;
    let goalsCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getGoalsCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        goalsCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        goalsCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        goalsCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        goalsCreatedThisMonthCount += count;
      }
    }

    return {
      goalsCreatedTodayCount,
      goalsCreatedYesterdayCount,
      goalsCreatedThisWeekCount,
      goalsCreatedThisMonthCount,
    };
  }

  async getGoalsCreated(user: User, from?: Date, to?: Date): Promise<StatisticsDateCountData> {
    let where = eq(goals.userId, user.id);

    if (from && to) {
      where = and(where, between(goals.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(goals.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(goals.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<string>`DATE(${goals.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(goals).mapWith(Number) })
      .from(goals)
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

export const goalsStatisticsManager = new GoalsStatisticsManager();
