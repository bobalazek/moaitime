import { DBQueryConfig, desc, eq } from 'drizzle-orm';

import {
  getDatabase,
  insertTestingEmailSchema,
  NewTestingEmail,
  TestingEmail,
  testingEmails,
  updateTestingEmailSchema,
} from '@myzenbuddy/database-core';

export class TestingEmailsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<TestingEmail[]> {
    return getDatabase().query.testingEmails.findMany(options);
  }

  async findOneById(id: string): Promise<TestingEmail | null> {
    const row = await getDatabase().query.testingEmails.findFirst({
      where: eq(testingEmails.id, id),
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
    data = insertTestingEmailSchema.parse(data) as unknown as NewTestingEmail;

    const rows = await getDatabase().insert(testingEmails).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewTestingEmail>): Promise<TestingEmail> {
    data = updateTestingEmailSchema.parse(data) as unknown as NewTestingEmail;

    const rows = await getDatabase()
      .update(testingEmails)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(testingEmails.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<TestingEmail> {
    const rows = await getDatabase()
      .delete(testingEmails)
      .where(eq(testingEmails.id, id))
      .returning();

    return rows[0];
  }
}

export const testingEmailsManager = new TestingEmailsManager();
