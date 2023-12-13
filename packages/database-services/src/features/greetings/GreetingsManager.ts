import { getDatabase, Greeting, greetings, NewGreeting } from '@moaitime/database-core';
import { DBQueryConfig, eq } from 'drizzle-orm';

export class GreetingsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Greeting[]> {
    return getDatabase().query.greetings.findMany(options);
  }

  async findOneById(id: string): Promise<Greeting | null> {
    const row = await getDatabase().query.greetings.findFirst({
      where: eq(greetings.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewGreeting): Promise<Greeting> {
    const rows = await getDatabase().insert(greetings).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewGreeting>): Promise<Greeting> {
    const rows = await getDatabase()
      .update(greetings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(greetings.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Greeting> {
    const rows = await getDatabase().delete(greetings).where(eq(greetings.id, id)).returning();

    return rows[0];
  }
}

export const greetingsManager = new GreetingsManager();
