import { and, DBQueryConfig, desc, eq, isNull } from 'drizzle-orm';

import { getDatabase, NewNote, Note, notes } from '@moaitime/database-core';

export class NotesManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Note[]> {
    return getDatabase().query.notes.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Note[]> {
    return getDatabase().query.notes.findMany({
      where: and(eq(notes.userId, userId), isNull(notes.deletedAt)),
      orderBy: desc(notes.updatedAt),
    });
  }

  async findOneById(id: string): Promise<Note | null> {
    const row = await getDatabase().query.notes.findFirst({
      where: eq(notes.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewNote): Promise<Note> {
    const rows = await getDatabase().insert(notes).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewNote>): Promise<Note> {
    const rows = await getDatabase()
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Note> {
    const rows = await getDatabase().delete(notes).where(eq(notes.id, id)).returning();
    notes;
    return rows[0];
  }
}

export const notesManager = new NotesManager();
