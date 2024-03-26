import { subDays } from 'date-fns';
import { and, count, eq, gt } from 'drizzle-orm';

import {
  feedbackEntries,
  FeedbackEntry,
  getDatabase,
  NewFeedbackEntry,
} from '@moaitime/database-core';
import { CreateFeedbackEntry } from '@moaitime/shared-common';

export class FeedbackEntriesManager {
  // API Helpers
  async create(actorUserId: string, data: CreateFeedbackEntry) {
    const oneDayAgo = subDays(new Date(), 1);

    const result = await getDatabase()
      .select({
        count: count(feedbackEntries.id).mapWith(Number),
      })
      .from(feedbackEntries)
      .where(and(eq(feedbackEntries.userId, actorUserId), gt(feedbackEntries.createdAt, oneDayAgo)))
      .execute();

    const rowsCount = result[0].count ?? 0;
    if (rowsCount >= 3) {
      throw new Error('You can only submit 3 feedback entries per day');
    }

    return this.insertOne({
      ...data,
      userId: actorUserId,
    });
  }

  // Helpers
  async findOneById(feedbackEntryId: string): Promise<FeedbackEntry | null> {
    const row = await getDatabase().query.feedbackEntries.findFirst({
      where: eq(feedbackEntries.id, feedbackEntryId),
    });

    if (!row) {
      return null;
    }

    return row;
  }

  async insertOne(data: NewFeedbackEntry): Promise<FeedbackEntry> {
    const rows = await getDatabase().insert(feedbackEntries).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    feedbackEntryId: string,
    data: Partial<NewFeedbackEntry>
  ): Promise<FeedbackEntry> {
    const rows = await getDatabase()
      .update(feedbackEntries)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(feedbackEntries.id, feedbackEntryId))
      .returning();

    return rows[0];
  }

  async deleteOneById(feedbackEntryId: string): Promise<FeedbackEntry> {
    const rows = await getDatabase()
      .delete(feedbackEntries)
      .where(eq(feedbackEntries.id, feedbackEntryId))
      .returning();

    return rows[0];
  }
}

export const feedbackEntriesManager = new FeedbackEntriesManager();
