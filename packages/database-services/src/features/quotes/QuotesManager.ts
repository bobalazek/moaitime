import { eq } from 'drizzle-orm';

import { getDatabase, NewQuote, Quote, quotes } from '@moaitime/database-core';

export class QuotesManager {
  // API Helpers
  async list() {
    return getDatabase().query.quotes.findMany();
  }

  // Helpers
  async findOneById(quoteId: string): Promise<Quote | null> {
    const row = await getDatabase().query.quotes.findFirst({
      where: eq(quotes.id, quoteId),
    });

    return row ?? null;
  }

  async insertOne(data: NewQuote): Promise<Quote> {
    const rows = await getDatabase().insert(quotes).values(data).returning();

    return rows[0];
  }

  async updateOneById(quoteId: string, data: Partial<NewQuote>): Promise<Quote> {
    const rows = await getDatabase()
      .update(quotes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(quotes.id, quoteId))
      .returning();

    return rows[0];
  }

  async deleteOneById(quoteId: string): Promise<Quote> {
    const rows = await getDatabase().delete(quotes).where(eq(quotes.id, quoteId)).returning();

    return rows[0];
  }
}

export const quotesManager = new QuotesManager();
