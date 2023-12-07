import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  databaseClient,
  Greeting,
  greetings,
  insertGreetingSchema,
  NewGreeting,
  updateGreetingSchema,
} from '@myzenbuddy/database-core';

export class GreetingsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Greeting[]> {
    return databaseClient.query.greetings.findMany(options);
  }

  async findOneById(id: string): Promise<Greeting | null> {
    const row = await databaseClient.query.greetings.findFirst({
      where: eq(greetings.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewGreeting): Promise<Greeting> {
    data = insertGreetingSchema.parse(data) as unknown as Greeting;

    const rows = await databaseClient.insert(greetings).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewGreeting>): Promise<Greeting> {
    data = updateGreetingSchema.parse(data) as unknown as NewGreeting;

    const rows = await databaseClient
      .update(greetings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(greetings.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Greeting> {
    const rows = await databaseClient.delete(greetings).where(eq(greetings.id, id)).returning();

    return rows[0];
  }
}

export const greetingsManager = new GreetingsManager();
