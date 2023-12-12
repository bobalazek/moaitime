import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, NewQuote, Quote, quotes } from '@myzenbuddy/database-core';

export class QuotesManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Quote[]> {
    return getDatabase().query.quotes.findMany(options);
  }

  async findOneById(id: string): Promise<Quote | null> {
    const row = await getDatabase().query.quotes.findFirst({
      where: eq(quotes.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewQuote): Promise<Quote> {
    const rows = await getDatabase().insert(quotes).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewQuote>): Promise<Quote> {
    const rows = await getDatabase()
      .update(quotes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Quote> {
    const rows = await getDatabase().delete(quotes).where(eq(quotes.id, id)).returning();

    return rows[0];
  }
}

export const quotesManager = new QuotesManager();
