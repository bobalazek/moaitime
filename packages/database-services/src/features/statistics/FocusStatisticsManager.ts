import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { focusSessions, getDatabase, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsDateCountData,
  StatisticsFocusBasicData,
} from '@moaitime/shared-common';

export class FocusStatisticsManager {
  async getBasics(user: User): Promise<StatisticsFocusBasicData> {
    let focusSessionsCreatedTodayCount = 0;
    let focusSessionsCreatedYesterdayCount = 0;
    let focusSessionsCreatedThisWeekCount = 0;
    let focusSessionsCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getFocusSessionsCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        focusSessionsCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        focusSessionsCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        focusSessionsCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        focusSessionsCreatedThisMonthCount += count;
      }
    }

    return {
      focusSessionsCreatedTodayCount,
      focusSessionsCreatedYesterdayCount,
      focusSessionsCreatedThisWeekCount,
      focusSessionsCreatedThisMonthCount,
    };
  }

  async getFocusSessionsCreated(
    user: User,
    from?: Date,
    to?: Date
  ): Promise<StatisticsDateCountData> {
    let where = eq(focusSessions.userId, user.id);

    if (from && to) {
      where = and(where, between(focusSessions.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(focusSessions.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(focusSessions.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<Date>`DATE(${focusSessions.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(focusSessions).mapWith(Number) })
      .from(focusSessions)
      .where(where)
      .groupBy(createdAtDate)
      .execute();

    const result: StatisticsDateCountData = {};
    for (const row of rows) {
      result[format(row.date, 'yyyy-MM-dd')] = row.count;
    }

    if (from && to) {
      return padDataForRangeMap(result, from, to);
    }

    return result;
  }
}

export const focusStatisticsManager = new FocusStatisticsManager();
