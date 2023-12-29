import { DBQueryConfig, desc, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserDataExport,
  UserDataExport,
  userDataExports,
} from '@moaitime/database-core';

export class UserDataExportsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserDataExport[]> {
    return getDatabase().query.userDataExports.findMany(options);
  }

  async findOneById(id: string): Promise<UserDataExport | null> {
    const row = await getDatabase().query.userDataExports.findFirst({
      where: eq(userDataExports.id, id),
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

  async insertOne(data: NewUserDataExport): Promise<UserDataExport> {
    const rows = await getDatabase().insert(userDataExports).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUserDataExport>): Promise<UserDataExport> {
    const rows = await getDatabase()
      .update(userDataExports)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userDataExports.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserDataExport> {
    const rows = await getDatabase()
      .delete(userDataExports)
      .where(eq(userDataExports.id, id))
      .returning();

    return rows[0];
  }
}

export const userDataExportsManager = new UserDataExportsManager();
