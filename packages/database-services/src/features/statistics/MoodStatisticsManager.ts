import { format } from 'date-fns';
import { and, avg, gte, isNull, lte, sql } from 'drizzle-orm';

import { getDatabase, moodEntries, User } from '@moaitime/database-core';

export class MoodStatisticsManager {
  async getDailyAverage(
    user: User,
    from: Date,
    to: Date
  ): Promise<{ date: string; score: number }[]> {
    const loggedAtDate = sql<Date>`DATE(${moodEntries.loggedAt})`;

    const where = and(
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
