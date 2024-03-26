import { utcToZonedTime } from 'date-fns-tz';
import { eq, sql } from 'drizzle-orm';

import { getDatabase, Greeting, greetings, NewGreeting, User } from '@moaitime/database-core';

import { usersManager } from '../auth/UsersManager';

export class GreetingsManager {
  // API Helpers
  async list(actorUser: User) {
    return this.getGreetings(actorUser);
  }

  // Helpers
  async findManyRandom(limit = 10): Promise<Greeting[]> {
    return getDatabase().query.greetings.findMany({
      limit,
      orderBy: sql`RANDOM()`,
    });
  }

  async findOneById(greetingId: string): Promise<Greeting | null> {
    const row = await getDatabase().query.greetings.findFirst({
      where: eq(greetings.id, greetingId),
    });

    return row ?? null;
  }

  async insertOne(data: NewGreeting): Promise<Greeting> {
    const rows = await getDatabase().insert(greetings).values(data).returning();

    return rows[0];
  }

  async updateOneById(greetingId: string, data: Partial<NewGreeting>): Promise<Greeting> {
    const rows = await getDatabase()
      .update(greetings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(greetings.id, greetingId))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Greeting> {
    const rows = await getDatabase().delete(greetings).where(eq(greetings.id, id)).returning();

    return rows[0];
  }

  async getGreetings(user: User, limit = 20) {
    const { generalTimezone } = usersManager.getUserSettings(user);

    const now = new Date();
    const localTime = utcToZonedTime(now, generalTimezone);

    const suitableGreetings: Greeting[] = [];
    const maxAttempts = 3;
    const initialBatchMultiplier = 2;
    let attempts = 0;

    while (suitableGreetings.length < limit && attempts < maxAttempts) {
      const batchSize =
        attempts === 0 ? limit * initialBatchMultiplier : limit - suitableGreetings.length;
      const greetings = await this.findManyRandom(batchSize);

      const filteredGreetings = greetings.filter((greeting) => {
        try {
          return greeting.query ? this.queryEvaluator(greeting.query, localTime) : true;
        } catch {
          return false;
        }
      });

      suitableGreetings.push(...filteredGreetings.slice(0, limit - suitableGreetings.length));
      attempts++;

      if (suitableGreetings.length >= limit) {
        break;
      }
    }

    return suitableGreetings.slice(0, limit);
  }

  queryEvaluator(query: string, now: Date) {
    const hour = now.getHours();
    const minute = now.getMinutes();
    const second = now.getSeconds();

    const vars = {
      hour,
      minute,
      second,
    };

    // TODO: Use a safer way to evaluate the query

    // eslint-disable-next-line no-new-func
    const evaluator = new Function('vars', `return ${query};`);

    return evaluator(vars);
  }
}

export const greetingsManager = new GreetingsManager();
