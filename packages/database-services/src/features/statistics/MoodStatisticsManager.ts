import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { getDatabase, moodEntries, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsDateCountData,
  StatisticsMoodBasicData,
} from '@moaitime/shared-common';

export class MoodStatisticsManager {
  // Helpers
  async getBasics(user: User): Promise<StatisticsMoodBasicData> {
    let moodEntriesCreatedTodayCount = 0;
    let moodEntriesCreatedYesterdayCount = 0;
    let moodEntriesCreatedThisWeekCount = 0;
    let moodEntriesCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getMoodEntriesCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        moodEntriesCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        moodEntriesCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        moodEntriesCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        moodEntriesCreatedThisMonthCount += count;
      }
    }

    return {
      moodEntriesCreatedTodayCount,
      moodEntriesCreatedYesterdayCount,
      moodEntriesCreatedThisWeekCount,
      moodEntriesCreatedThisMonthCount,
    };
  }

  async getMoodEntriesCreated(
    user: User,
    from?: Date,
    to?: Date
  ): Promise<StatisticsDateCountData> {
    let where = eq(moodEntries.userId, user.id);

    if (from && to) {
      where = and(where, between(moodEntries.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(moodEntries.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(moodEntries.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<string>`DATE(${moodEntries.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(moodEntries).mapWith(Number) })
      .from(moodEntries)
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

export const moodStatisticsManager = new MoodStatisticsManager();
