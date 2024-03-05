import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { getDatabase, notes, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsDateCountData,
  StatisticsNotesBasicData,
} from '@moaitime/shared-common';

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

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getNotesCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        notesCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        notesCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        notesCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        notesCreatedThisMonthCount += count;
      }
    }

    return {
      notesCreatedTodayCount,
      notesCreatedYesterdayCount,
      notesCreatedThisWeekCount,
      notesCreatedThisMonthCount,
    };
  }

  async getNotesCreated(user: User, from?: Date, to?: Date): Promise<StatisticsDateCountData> {
    let where = eq(notes.userId, user.id);

    if (from && to) {
      where = and(where, between(notes.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(notes.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(notes.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<Date>`DATE(${notes.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(notes).mapWith(Number) })
      .from(notes)
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

export const notesStatisticsManager = new NotesStatisticsManager();
