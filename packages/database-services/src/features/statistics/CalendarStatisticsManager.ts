import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, count, eq, gte, isNull, sql } from 'drizzle-orm';

import { events, getDatabase, User } from '@moaitime/database-core';
import { StatisticsCalendarBasicData } from '@moaitime/shared-common';

export class CalendarStatisticsManager {
  async getBasics(user: User): Promise<StatisticsCalendarBasicData> {
    let eventsCreatedTodayCount = 0;
    let eventsCreatedYesterdayCount = 0;
    let eventsCreatedThisWeekCount = 0;
    let eventsCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const createdAtDate = sql<Date>`DATE(${events.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(events).mapWith(Number) })
      .from(events)
      .where(
        and(
          eq(events.userId, user.id),
          isNull(events.deletedAt),
          gte(events.createdAt, startOfThisMonth)
        )
      )
      .groupBy(createdAtDate)
      .execute();

    for (const row of rows) {
      const rowDateString = format(row.date, 'yyyy-MM-dd');
      if (rowDateString === format(today, 'yyyy-MM-dd')) {
        eventsCreatedTodayCount = row.count;
      }

      if (rowDateString === format(yesterday, 'yyyy-MM-dd')) {
        eventsCreatedYesterdayCount = row.count;
      }

      if (row.date >= startOfThisWeek) {
        eventsCreatedThisWeekCount += row.count;
      }

      if (row.date >= startOfThisMonth) {
        eventsCreatedThisMonthCount += row.count;
      }
    }

    return {
      eventsCreatedTodayCount,
      eventsCreatedYesterdayCount,
      eventsCreatedThisWeekCount,
      eventsCreatedThisMonthCount,
    };
  }
}

export const calendarStatisticsManager = new CalendarStatisticsManager();
