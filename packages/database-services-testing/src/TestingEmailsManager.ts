import { desc, eq } from 'drizzle-orm';

import { getDatabase, NewTestingEmail, TestingEmail, testingEmails } from '@moaitime/database-core';

export class TestingEmailsManager {
  async findOneById(testingEmailId: string): Promise<TestingEmail | null> {
    const row = await getDatabase().query.testingEmails.findFirst({
      where: eq(testingEmails.id, testingEmailId),
    });

    return row ?? null;
  }

  async findOneNewest(): Promise<TestingEmail | null> {
    const row = await getDatabase().query.testingEmails.findFirst({
      orderBy: [desc(testingEmails.createdAt)],
    });

    return row ?? null;
  }

  async insertOne(data: NewTestingEmail): Promise<TestingEmail> {
    const rows = await getDatabase().insert(testingEmails).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    testingEmailId: string,
    data: Partial<NewTestingEmail>
  ): Promise<TestingEmail> {
    const rows = await getDatabase()
      .update(testingEmails)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(testingEmails.id, testingEmailId))
      .returning();

    return rows[0];
  }

  async deleteOneById(testingEmailId: string): Promise<TestingEmail> {
    const rows = await getDatabase()
      .delete(testingEmails)
      .where(eq(testingEmails.id, testingEmailId))
      .returning();

    return rows[0];
  }
}

export const testingEmailsManager = new TestingEmailsManager();
