import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { events, getDatabase, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsCalendarBasicData,
  StatisticsDateCountData,
} from '@moaitime/shared-common';

export class CalendarStatisticsManager {
  // Helpers
  async getBasics(user: User): Promise<StatisticsCalendarBasicData> {
    let eventsCreatedTodayCount = 0;
    let eventsCreatedYesterdayCount = 0;
    let eventsCreatedThisWeekCount = 0;
    let eventsCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getEventsCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        eventsCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        eventsCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        eventsCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        eventsCreatedThisMonthCount += count;
      }
    }

    return {
      eventsCreatedTodayCount,
      eventsCreatedYesterdayCount,
      eventsCreatedThisWeekCount,
      eventsCreatedThisMonthCount,
    };
  }

  async getEventsCreated(user: User, from?: Date, to?: Date): Promise<StatisticsDateCountData> {
    let where = eq(events.userId, user.id);

    if (from && to) {
      where = and(where, between(events.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(events.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(events.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<string>`DATE(${events.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(events).mapWith(Number) })
      .from(events)
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

export const calendarStatisticsManager = new CalendarStatisticsManager();
