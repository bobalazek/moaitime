import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  databaseClient,
  insertQuoteSchema,
  NewQuote,
  Quote,
  quotes,
  updateQuoteSchema,
} from '@myzenbuddy/database-core';

export class QuotesManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Quote[]> {
    return databaseClient.query.quotes.findMany(options);
  }

  async findOneById(id: string): Promise<Quote | null> {
    const row = await databaseClient.query.quotes.findFirst({
      where: eq(quotes.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewQuote): Promise<Quote> {
    data = insertQuoteSchema.parse(data) as unknown as Quote;

    const rows = await databaseClient.insert(quotes).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewQuote>): Promise<Quote> {
    data = updateQuoteSchema.parse(data) as unknown as NewQuote;

    const rows = await databaseClient
      .update(quotes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Quote> {
    const rows = await databaseClient.delete(quotes).where(eq(quotes.id, id)).returning();

    return rows[0];
  }
}

export const quotesManager = new QuotesManager();
