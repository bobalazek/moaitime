import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, avg, count, eq, gte, isNull, lte, sql } from 'drizzle-orm';

import { getDatabase, moodEntries, User } from '@moaitime/database-core';
import { StatisticsMoodBasicData } from '@moaitime/shared-common';

export class MoodStatisticsManager {
  async getBasics(user: User): Promise<StatisticsMoodBasicData> {
    let moodEntriesCreatedTodayCount = 0;
    let moodEntriesCreatedYesterdayCount = 0;
    let moodEntriesCreatedThisWeekCount = 0;
    let moodEntriesCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const createdAtDate = sql<Date>`DATE(${moodEntries.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(moodEntries).mapWith(Number) })
      .from(moodEntries)
      .where(
        and(
          eq(moodEntries.userId, user.id),
          isNull(moodEntries.deletedAt),
          gte(moodEntries.createdAt, startOfThisMonth)
        )
      )
      .groupBy(createdAtDate)
      .execute();

    for (const row of rows) {
      const rowDateString = format(row.date, 'yyyy-MM-dd');
      if (rowDateString === format(today, 'yyyy-MM-dd')) {
        moodEntriesCreatedTodayCount = row.count;
      }

      if (rowDateString === format(yesterday, 'yyyy-MM-dd')) {
        moodEntriesCreatedYesterdayCount = row.count;
      }

      if (row.date >= startOfThisWeek) {
        moodEntriesCreatedThisWeekCount += row.count;
      }

      if (row.date >= startOfThisMonth) {
        moodEntriesCreatedThisMonthCount += row.count;
      }
    }

    return {
      moodEntriesCreatedTodayCount,
      moodEntriesCreatedYesterdayCount,
      moodEntriesCreatedThisWeekCount,
      moodEntriesCreatedThisMonthCount,
    };
  }

  async getDailyAverage(
    user: User,
    from: Date,
    to: Date
  ): Promise<{ date: string; score: number }[]> {
    const loggedAtDate = sql<Date>`DATE(${moodEntries.loggedAt})`;

    const where = and(
      eq(moodEntries.userId, user.id),
      gte(moodEntries.loggedAt, from.toISOString()),
      lte(moodEntries.loggedAt, to.toISOString()),
      isNull(moodEntries.deletedAt)
    );

    const rows = await getDatabase()
      .select({ date: loggedAtDate, score: avg(moodEntries.happinessScore).mapWith(Number) })
      .from(moodEntries)
      .where(where)
      .groupBy(loggedAtDate)
      .execute();

    return rows.map((row) => ({
      date: format(row.date, 'yyyy-MM-dd'),
      score: row.score ?? 0,
    }));
  }
}

export const moodStatisticsManager = new MoodStatisticsManager();
