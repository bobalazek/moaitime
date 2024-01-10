import {
  and,
  count,
  DBQueryConfig,
  desc,
  eq,
  gt,
  gte,
  isNull,
  lt,
  lte,
  or,
  sql,
  SQL,
} from 'drizzle-orm';

import { getDatabase, moodEntries, MoodEntry, NewMoodEntry } from '@moaitime/database-core';

export type MoodEntriesManagerFindOptions = {
  includeDeleted?: boolean;
  from?: Date;
  to?: Date;
  afterCursor?: string;
  beforeCursor?: string;
  limit?: number;
};

export class MoodEntriesManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<MoodEntry[]> {
    const rows = await getDatabase().query.moodEntries.findMany(options);

    return rows.map((row) => {
      return this._fixRowColumns(row);
    });
  }

  async findManyByUserId(
    userId: string,
    options?: MoodEntriesManagerFindOptions
  ): Promise<{ data: MoodEntry[]; beforeCursor?: string; afterCursor?: string }> {
    let where = eq(moodEntries.userId, userId);

    const loggedAtDate = sql<Date>`DATE(${moodEntries.loggedAt})`;

    if (!options?.includeDeleted) {
      where = and(where, isNull(moodEntries.deletedAt)) as SQL<unknown>;
    }

    if (options?.from && options?.to) {
      where = and(
        where,
        or(
          and(gte(loggedAtDate, options.from), lte(loggedAtDate, options.to)),
          and(lt(loggedAtDate, options.from), gt(loggedAtDate, options.to))
        )
      ) as SQL<unknown>;
    } else if (options?.from) {
      where = and(where, gte(loggedAtDate, options.from)) as SQL<unknown>;
    } else if (options?.to) {
      where = and(where, lte(loggedAtDate, options.to)) as SQL<unknown>;
    }

    if (options?.afterCursor) {
      const { id: afterId, loggedAt: afterLoggedAt } = this._cursorToProperties(
        options.afterCursor
      );

      where = and(
        where,
        or(
          and(gt(loggedAtDate, afterLoggedAt), gt(moodEntries.id, afterId)),
          gt(loggedAtDate, afterLoggedAt)
        )
      ) as SQL<unknown>;
    }

    if (options?.beforeCursor) {
      const { id: beforeId, loggedAt: beforeLoggedAt } = this._cursorToProperties(
        options.beforeCursor
      );

      where = and(
        where,
        or(
          and(lt(loggedAtDate, beforeLoggedAt), lt(moodEntries.id, beforeId)),
          lt(loggedAtDate, beforeLoggedAt)
        )
      ) as SQL<unknown>;
    }

    const rows = await getDatabase().query.moodEntries.findMany({
      where,
      orderBy: [desc(moodEntries.loggedAt), desc(moodEntries.id)],
      limit: options?.limit,
    });

    const data = rows.map((row) => {
      return this._fixRowColumns(row);
    });

    const beforeCursor =
      data.length > 0
        ? this._propertiesToCursor({
            id: data[data.length - 1].id,
            loggedAt: data[data.length - 1].loggedAt,
          })
        : undefined;
    const afterCursor =
      data.length > 0
        ? this._propertiesToCursor({
            id: data[0].id,
            loggedAt: data[0].loggedAt,
          })
        : undefined;

    return {
      data,
      beforeCursor,
      afterCursor,
    };
  }

  async findOneById(id: string): Promise<MoodEntry | null> {
    const row = await getDatabase().query.moodEntries.findFirst({
      where: eq(moodEntries.id, id),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<MoodEntry | null> {
    const row = await getDatabase().query.moodEntries.findFirst({
      where: and(eq(moodEntries.id, id), eq(moodEntries.userId, userId)),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async insertOne(data: NewMoodEntry): Promise<MoodEntry> {
    const rows = await getDatabase().insert(moodEntries).values(data).returning();

    return this._fixRowColumns(rows[0]);
  }

  async updateOneById(id: string, data: Partial<NewMoodEntry>): Promise<MoodEntry> {
    const rows = await getDatabase()
      .update(moodEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(moodEntries.id, id))
      .returning();

    return this._fixRowColumns(rows[0]);
  }

  async deleteOneById(id: string): Promise<MoodEntry> {
    const rows = await getDatabase().delete(moodEntries).where(eq(moodEntries.id, id)).returning();

    return this._fixRowColumns(rows[0]);
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(moodEntries.id).mapWith(Number),
      })
      .from(moodEntries)
      .where(and(eq(moodEntries.userId, userId), isNull(moodEntries.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async userCanView(userId: string, moodEntryId: string): Promise<boolean> {
    const row = await getDatabase().query.moodEntries.findFirst({
      where: and(eq(moodEntries.id, moodEntryId), eq(moodEntries.userId, userId)),
    });

    return row !== null;
  }

  async userCanUpdate(userId: string, moodEntryId: string): Promise<boolean> {
    return this.userCanView(userId, moodEntryId);
  }

  async userCanDelete(userId: string, moodEntryId: string): Promise<boolean> {
    return this.userCanUpdate(userId, moodEntryId);
  }

  // Private
  private _fixRowColumns(moodEntry: MoodEntry) {
    // TODO
    // Bug in drizzle: https://github.com/drizzle-team/drizzle-orm/issues/1185.
    // Should actually be a string

    // Keep in mind that once that is fixed,
    // we will still need to keep this to remove the Z,
    // as the loggedAt date stored here, is local, not UTC!
    if (moodEntry.loggedAt && (moodEntry.loggedAt as unknown as Date) instanceof Date) {
      moodEntry.loggedAt = (moodEntry.loggedAt as unknown as Date).toISOString().slice(0, -1);
    }

    return moodEntry;
  }

  private _propertiesToCursor(properties: { id: string; loggedAt: string }): string {
    return btoa(JSON.stringify(properties));
  }

  private _cursorToProperties(cursor: string): { id: string; loggedAt: string } {
    return JSON.parse(atob(cursor));
  }
}

export const moodEntriesManager = new MoodEntriesManager();
