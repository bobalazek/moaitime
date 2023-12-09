import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabaseClient,
  Greeting,
  greetings,
  insertGreetingSchema,
  NewGreeting,
  updateGreetingSchema,
} from '@myzenbuddy/database-core';

export class GreetingsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Greeting[]> {
    return getDatabaseClient().query.greetings.findMany(options);
  }

  async findOneById(id: string): Promise<Greeting | null> {
    const row = await getDatabaseClient().query.greetings.findFirst({
      where: eq(greetings.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewGreeting): Promise<Greeting> {
    data = insertGreetingSchema.parse(data) as unknown as Greeting;

    const rows = await getDatabaseClient().insert(greetings).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewGreeting>): Promise<Greeting> {
    data = updateGreetingSchema.parse(data) as unknown as NewGreeting;

    const rows = await getDatabaseClient()
      .update(greetings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(greetings.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Greeting> {
    const rows = await getDatabaseClient()
      .delete(greetings)
      .where(eq(greetings.id, id))
      .returning();

    return rows[0];
  }
}

export const greetingsManager = new GreetingsManager();
