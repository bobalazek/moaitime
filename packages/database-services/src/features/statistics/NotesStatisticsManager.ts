import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, count, eq, gte, isNull, sql } from 'drizzle-orm';

import { getDatabase, notes, User } from '@moaitime/database-core';
import { StatisticsNotesBasicData } from '@moaitime/shared-common';

export class NotesStatisticsManager {
  async getBasics(user: User): Promise<StatisticsNotesBasicData> {
    let notesCreatedTodayCount = 0;
    let notesCreatedYesterdayCount = 0;
    let notesCreatedThisWeekCount = 0;
    let notesCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const createdAtDate = sql<Date>`DATE(${notes.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(notes).mapWith(Number) })
      .from(notes)
      .where(
        and(
          eq(notes.userId, user.id),
          isNull(notes.deletedAt),
          gte(notes.createdAt, startOfThisMonth)
        )
      )
      .groupBy(createdAtDate)
      .execute();

    for (const row of rows) {
      const rowDateString = format(row.date, 'yyyy-MM-dd');
      if (rowDateString === format(today, 'yyyy-MM-dd')) {
        notesCreatedTodayCount = row.count;
      }

      if (rowDateString === format(yesterday, 'yyyy-MM-dd')) {
        notesCreatedYesterdayCount = row.count;
      }

      if (row.date >= startOfThisWeek) {
        notesCreatedThisWeekCount += row.count;
      }

      if (row.date >= startOfThisMonth) {
        notesCreatedThisMonthCount += row.count;
      }
    }

    return {
      notesCreatedTodayCount,
      notesCreatedYesterdayCount,
      notesCreatedThisWeekCount,
      notesCreatedThisMonthCount,
    };
  }
}

export const notesStatisticsManager = new NotesStatisticsManager();
