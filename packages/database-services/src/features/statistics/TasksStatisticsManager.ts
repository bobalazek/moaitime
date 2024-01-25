import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, count, eq, gte, isNull, sql } from 'drizzle-orm';

import { getDatabase, tasks, User } from '@moaitime/database-core';
import { StatisticsTasksBasicData } from '@moaitime/shared-common';

export class TasksStatisticsManager {
  async getBasics(user: User): Promise<StatisticsTasksBasicData> {
    let tasksCreatedTodayCount = 0;
    let tasksCreatedYesterdayCount = 0;
    let tasksCreatedThisWeekCount = 0;
    let tasksCreatedThisMonthCount = 0;

    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const startOfThisWeek = startOfWeek(today);
    const startOfThisMonth = startOfMonth(today);

    const createdAtDate = sql<Date>`DATE(${tasks.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(tasks).mapWith(Number) })
      .from(tasks)
      .where(
        and(
          eq(tasks.userId, user.id),
          isNull(tasks.deletedAt),
          gte(tasks.createdAt, startOfThisMonth)
        )
      )
      .groupBy(createdAtDate)
      .execute();

    for (const row of rows) {
      const rowDateString = format(row.date, 'yyyy-MM-dd');
      if (rowDateString === format(today, 'yyyy-MM-dd')) {
        tasksCreatedTodayCount = row.count;
      }

      if (rowDateString === format(yesterday, 'yyyy-MM-dd')) {
        tasksCreatedYesterdayCount = row.count;
      }

      if (row.date >= startOfThisWeek) {
        tasksCreatedThisWeekCount += row.count;
      }

      if (row.date >= startOfThisMonth) {
        tasksCreatedThisMonthCount += row.count;
      }
    }

    return {
      tasksCreatedTodayCount,
      tasksCreatedYesterdayCount,
      tasksCreatedThisWeekCount,
      tasksCreatedThisMonthCount,
    };
  }
}

export const tasksStatisticsManager = new TasksStatisticsManager();
