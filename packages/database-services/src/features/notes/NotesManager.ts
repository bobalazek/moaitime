import { and, asc, count, DBQueryConfig, desc, eq, ilike, isNull } from 'drizzle-orm';

import { getDatabase, NewNote, Note, notes, NoteWithoutContent } from '@moaitime/database-core';
import { NotesListSortFieldEnum, SortDirectionEnum } from '@moaitime/shared-common';

export type NotesManagerFindManyByUserIdWithOptions = {
  search?: string;
  sortField?: NotesListSortFieldEnum;
  sortDirection?: SortDirectionEnum;
};

export class NotesManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Note[]> {
    return getDatabase().query.notes.findMany(options);
  }

  async findManyByUserId(userId: string): Promise<Note[]> {
    return getDatabase().query.notes.findMany({
      where: and(eq(notes.userId, userId), isNull(notes.deletedAt)),
      orderBy: desc(notes.createdAt),
    });
  }

  async findManyByUserIdWithOptions(
    userId: string,
    options?: NotesManagerFindManyByUserIdWithOptions
  ): Promise<NoteWithoutContent[]> {
    let where = and(eq(notes.userId, userId), isNull(notes.deletedAt));
    let orderBy = desc(notes.createdAt);

    if (options?.search) {
      where = and(ilike(notes.title, `%${options.search}%`));
    }

    if (options?.sortField) {
      const direction = options?.sortDirection ?? SortDirectionEnum.ASC;
      const field = notes[options.sortField] ?? notes.title;

      orderBy = direction === SortDirectionEnum.ASC ? asc(field) : desc(field);
    }

    return getDatabase().query.notes.findMany({
      where,
      orderBy,
      columns: {
        content: false,
      },
    });
  }

  async findOneById(id: string): Promise<Note | null> {
    const row = await getDatabase().query.notes.findFirst({
      where: eq(notes.id, id),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<Note | null> {
    const row = await getDatabase().query.notes.findFirst({
      where: and(eq(notes.id, id), eq(notes.userId, userId)),
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

    return rows[0];
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(notes.id).mapWith(Number),
      })
      .from(notes)
      .where(and(eq(notes.userId, userId), isNull(notes.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async userCanView(userId: string, noteId: string): Promise<boolean> {
    const row = await getDatabase().query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.userId, userId)),
    });

    return row !== null;
  }

  async userCanUpdate(userId: string, noteId: string): Promise<boolean> {
    return this.userCanView(userId, noteId);
  }

  async userCanDelete(userId: string, noteId: string): Promise<boolean> {
    return this.userCanUpdate(userId, noteId);
  }
}

export const notesManager = new NotesManager();
