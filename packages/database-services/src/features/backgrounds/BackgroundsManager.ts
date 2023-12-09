import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  Background,
  backgrounds,
  getDatabase,
  insertBackgroundSchema,
  NewBackground,
  updateBackgroundSchema,
} from '@myzenbuddy/database-core';

export class BackgroundsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Background[]> {
    return getDatabase().query.backgrounds.findMany(options);
  }

  async findOneById(id: string): Promise<Background | null> {
    const row = await getDatabase().query.backgrounds.findFirst({
      where: eq(backgrounds.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewBackground): Promise<Background> {
    data = insertBackgroundSchema.parse(data) as unknown as Background;

    const rows = await getDatabase().insert(backgrounds).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewBackground>): Promise<Background> {
    data = updateBackgroundSchema.parse(data) as unknown as NewBackground;

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
