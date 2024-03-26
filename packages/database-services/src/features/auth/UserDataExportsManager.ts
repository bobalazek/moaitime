import { asc, desc, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserDataExport,
  UserDataExport,
  userDataExports,
} from '@moaitime/database-core';
import { ProcessingStatusEnum } from '@moaitime/shared-common';

export class UserDataExportsManager {
  // Helpers
  async findOneById(userDataExportId: string): Promise<UserDataExport | null> {
    const row = await getDatabase().query.userDataExports.findFirst({
      where: eq(userDataExports.id, userDataExportId),
    });

    return row ?? null;
  }

  async findOneLatestByUserId(userId: string): Promise<UserDataExport | null> {
    const row = await getDatabase().query.userDataExports.findFirst({
      where: eq(userDataExports.userId, userId),
      orderBy: desc(userDataExports.createdAt),
    });

    return row ?? null;
  }

  async findOneOldestPending(): Promise<UserDataExport | null> {
    const row = await getDatabase().query.userDataExports.findFirst({
      where: eq(userDataExports.processingStatus, ProcessingStatusEnum.PENDING),
      orderBy: asc(userDataExports.createdAt),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserDataExport): Promise<UserDataExport> {
    const rows = await getDatabase().insert(userDataExports).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    userDataExportId: string,
    data: Partial<NewUserDataExport>
  ): Promise<UserDataExport> {
    const rows = await getDatabase()
      .update(userDataExports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userDataExports.id, userDataExportId))
      .returning();

    return rows[0];
  }

  async deleteOneById(userDataExportId: string): Promise<UserDataExport> {
    const rows = await getDatabase()
      .delete(userDataExports)
      .where(eq(userDataExports.id, userDataExportId))
      .returning();

    return rows[0];
  }
}

export const userDataExportsManager = new UserDataExportsManager();
