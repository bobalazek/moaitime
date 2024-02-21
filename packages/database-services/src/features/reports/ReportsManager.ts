import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, NewReport, Report, reports } from '@moaitime/database-core';

export class ReportsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Report[]> {
    return getDatabase().query.reports.findMany(options);
  }

  async findOneById(id: string): Promise<Report | null> {
    const row = await getDatabase().query.reports.findFirst({
      where: eq(reports.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewReport): Promise<Report> {
    const rows = await getDatabase().insert(reports).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewReport>): Promise<Report> {
    const rows = await getDatabase()
      .update(reports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(reports.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Report> {
    const rows = await getDatabase().delete(reports).where(eq(reports.id, id)).returning();

    return rows[0];
  }

  // API Helpers
  async list() {
    return this.findMany();
  }
}

export const reportsManager = new ReportsManager();
