import { eq } from 'drizzle-orm';

import { getDatabase, NewReport, Report, reports } from '@moaitime/database-core';

export class ReportsManager {
  // API Helpers
  async list() {
    return getDatabase().query.reports.findMany();
  }

  // Helpers
  async findOneById(reportId: string): Promise<Report | null> {
    const row = await getDatabase().query.reports.findFirst({
      where: eq(reports.id, reportId),
    });

    return row ?? null;
  }

  async insertOne(data: NewReport): Promise<Report> {
    const rows = await getDatabase().insert(reports).values(data).returning();

    return rows[0];
  }

  async updateOneById(reportId: string, data: Partial<NewReport>): Promise<Report> {
    const rows = await getDatabase()
      .update(reports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(reports.id, reportId))
      .returning();

    return rows[0];
  }

  async deleteOneById(reportId: string): Promise<Report> {
    const rows = await getDatabase().delete(reports).where(eq(reports.id, reportId)).returning();

    return rows[0];
  }
}

export const reportsManager = new ReportsManager();
