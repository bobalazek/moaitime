import {
  and,
  asc,
  count,
  DBQueryConfig,
  desc,
  eq,
  gt,
  gte,
  isNull,
  lt,
  lte,
  ne,
  or,
  SQL,
} from 'drizzle-orm';

import { getDatabase, moodEntries, MoodEntry, NewMoodEntry } from '@moaitime/database-core';
import { SortDirectionEnum } from '@moaitime/shared-common';

export type MoodEntriesManagerFindOptions = {
  includeDeleted?: boolean;
  from?: string;
  to?: string;
  nextCursor?: string;
  previousCursor?: string;
  limit?: number;
  sortDirection?: SortDirectionEnum;
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
  ): Promise<{
    data: MoodEntry[];
    meta: {
      previousCursor?: string;
      nextCursor?: string;
      sortDirection?: SortDirectionEnum;
      limit?: number;
    };
  }> {
    const limit = options?.limit ?? 20;
    const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;

    const isSortAscending = sortDirection === SortDirectionEnum.ASC;

    let orderWasReversed = false;
    let orderBy = isSortAscending ? asc(moodEntries.loggedAt) : desc(moodEntries.loggedAt);
    let where = eq(moodEntries.userId, userId);
    if (!options?.includeDeleted) {
      where = and(where, isNull(moodEntries.deletedAt)) as SQL<unknown>;
    }

    if (options?.from && options?.to) {
      where = and(
        where,
        gte(moodEntries.loggedAt, options.from),
        lte(moodEntries.loggedAt, options.to)
      ) as SQL<unknown>;
    } else if (options?.from) {
      where = and(where, gte(moodEntries.loggedAt, options.from)) as SQL<unknown>;
    } else if (options?.to) {
      where = and(where, lte(moodEntries.loggedAt, options.to)) as SQL<unknown>;
    }

    if (options?.previousCursor) {
      const { id: previousId, loggedAt: previousLoggedAt } = this._cursorToProperties(
        options.previousCursor
      );

      where = and(
        where,
        or(
          isSortAscending
            ? lt(moodEntries.loggedAt, previousLoggedAt)
            : gt(moodEntries.loggedAt, previousLoggedAt),
          and(eq(moodEntries.loggedAt, previousLoggedAt), ne(moodEntries.id, previousId))
        )
      ) as SQL<unknown>;

      // If we are going backwards, we need to reverse the order so we do not miss any entries in the middle
      orderBy = isSortAscending ? desc(moodEntries.loggedAt) : asc(moodEntries.loggedAt);
      orderWasReversed = true;
    }

    if (options?.nextCursor) {
      const { id: nextId, loggedAt: nextLoggedAt } = this._cursorToProperties(options.nextCursor);

      where = and(
        where,
        or(
          isSortAscending
            ? gt(moodEntries.loggedAt, nextLoggedAt)
            : lt(moodEntries.loggedAt, nextLoggedAt),
          and(eq(moodEntries.loggedAt, nextLoggedAt), ne(moodEntries.id, nextId))
        )
      ) as SQL<unknown>;
    }

    const rows = await getDatabase().query.moodEntries.findMany({
      where,
      orderBy,
      limit,
    });

    // Here we reverse the order back to what it was originally
    if (orderWasReversed) {
      rows.reverse();
    }

    const data = rows.map((row) => {
      return this._fixRowColumns(row);
    });

    let previousCursor: string | undefined;
    let nextCursor: string | undefined;
    if (data.length > 0) {
      const isLessThanLimit = data.length < (options?.limit ?? 0);
      const firstItem = data[0];
      const lastItem = data[data.length - 1];

      previousCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: firstItem.id,
            loggedAt: firstItem.loggedAt,
          })
        : undefined;
      nextCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: lastItem.id,
            loggedAt: lastItem.loggedAt,
          })
        : undefined;
    }

    if (!options?.previousCursor) {
      // Since no previousCursor was provided by the request,
      // we assume that this is the very first page, and because of that,
      // we certainly have no previous entries.
      previousCursor = undefined;
    }

    return {
      data,
      meta: {
        previousCursor,
        nextCursor,
        sortDirection,
        limit,
      },
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
