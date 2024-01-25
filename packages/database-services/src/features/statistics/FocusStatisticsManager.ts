import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, count, eq, gte, isNull, sql } from 'drizzle-orm';

import { focusSessions, getDatabase, User } from '@moaitime/database-core';
import { StatisticsFocusBasicData } from '@moaitime/shared-common';

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

    const createdAtDate = sql<Date>`DATE(${focusSessions.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(focusSessions).mapWith(Number) })
      .from(focusSessions)
      .where(
        and(
          eq(focusSessions.userId, user.id),
          isNull(focusSessions.deletedAt),
          gte(focusSessions.createdAt, startOfThisMonth)
        )
      )
      .groupBy(createdAtDate)
      .execute();

    for (const row of rows) {
      const rowDateString = format(row.date, 'yyyy-MM-dd');
      if (rowDateString === format(today, 'yyyy-MM-dd')) {
        focusSessionsCreatedTodayCount = row.count;
      }

      if (rowDateString === format(yesterday, 'yyyy-MM-dd')) {
        focusSessionsCreatedYesterdayCount = row.count;
      }

      if (row.date >= startOfThisWeek) {
        focusSessionsCreatedThisWeekCount += row.count;
      }

      if (row.date >= startOfThisMonth) {
        focusSessionsCreatedThisMonthCount += row.count;
      }
    }

    return {
      focusSessionsCreatedTodayCount,
      focusSessionsCreatedYesterdayCount,
      focusSessionsCreatedThisWeekCount,
      focusSessionsCreatedThisMonthCount,
    };
  }
}

export const focusStatisticsManager = new FocusStatisticsManager();
