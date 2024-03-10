import { format, startOfMonth, startOfWeek } from 'date-fns';
import { and, between, count, eq, gte, lte, SQL, sql } from 'drizzle-orm';

import { getDatabase, tasks, User } from '@moaitime/database-core';
import {
  padDataForRangeMap,
  StatisticsDateCountData,
  StatisticsTasksBasicData,
} from '@moaitime/shared-common';

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

    const todayString = format(today, 'yyyy-MM-dd');
    const yesterdayString = format(yesterday, 'yyyy-MM-dd');

    const rows = await this.getTasksCreated(user, startOfThisMonth);
    for (const date in rows) {
      const count = rows[date];
      const dateObject = new Date(date);

      if (date === todayString) {
        tasksCreatedTodayCount = count;
      }

      if (date === yesterdayString) {
        tasksCreatedYesterdayCount = count;
      }

      if (dateObject >= startOfThisWeek) {
        tasksCreatedThisWeekCount += count;
      }

      if (dateObject >= startOfThisMonth) {
        tasksCreatedThisMonthCount += count;
      }
    }

    return {
      tasksCreatedTodayCount,
      tasksCreatedYesterdayCount,
      tasksCreatedThisWeekCount,
      tasksCreatedThisMonthCount,
    };
  }

  async getTasksCreated(user: User, from?: Date, to?: Date): Promise<StatisticsDateCountData> {
    let where = eq(tasks.userId, user.id);

    if (from && to) {
      where = and(where, between(tasks.createdAt, from, to)) as SQL<unknown>;
    } else if (from) {
      where = and(where, gte(tasks.createdAt, from)) as SQL<unknown>;
    } else if (to) {
      where = and(where, lte(tasks.createdAt, to)) as SQL<unknown>;
    }

    const createdAtDate = sql<string>`DATE(${tasks.createdAt})`;
    const rows = await getDatabase()
      .select({ date: createdAtDate, count: count(tasks).mapWith(Number) })
      .from(tasks)
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

export const tasksStatisticsManager = new TasksStatisticsManager();
