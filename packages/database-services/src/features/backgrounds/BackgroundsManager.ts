import { eq } from 'drizzle-orm';

import { Background, backgrounds, getDatabase, NewBackground } from '@moaitime/database-core';

export class BackgroundsManager {
  // API Helpers
  async list() {
    return getDatabase().query.backgrounds.findMany();
  }

  // Helpers
  async findOneById(id: string): Promise<Background | null> {
    const row = await getDatabase().query.backgrounds.findFirst({
      where: eq(backgrounds.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewBackground): Promise<Background> {
    const rows = await getDatabase().insert(backgrounds).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewBackground>): Promise<Background> {
    const rows = await getDatabase()
      .update(backgrounds)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(backgrounds.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Background> {
    const rows = await getDatabase().delete(backgrounds).where(eq(backgrounds.id, id)).returning();

    return rows[0];
  }
}

export const backgroundsManager = new BackgroundsManager();
