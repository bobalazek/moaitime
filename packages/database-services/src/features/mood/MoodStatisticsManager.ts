import { and, avg, gte, isNull, lte, sql } from 'drizzle-orm';

import { getDatabase, moodEntries } from '@moaitime/database-core';

export class MoodStatisticsManager {
  async getDailyAverage(from: Date, to: Date): Promise<{ date: string; score: number }[]> {
    const loggedAtDate = sql<string>`DATE(${moodEntries.loggedAt})`;

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
      date: row.date,
      score: row.score ?? 0,
    }));
  }
}

export const moodStatisticsManager = new MoodStatisticsManager();
