import { and, asc, count, DBQueryConfig, desc, eq, ilike, isNull, SQL } from 'drizzle-orm';

import {
  getDatabase,
  NewNote,
  Note,
  notes,
  NoteWithoutContent,
  User,
} from '@moaitime/database-core';
import {
  CreateNote,
  NotesListSortFieldEnum,
  SortDirectionEnum,
  UpdateNote,
} from '@moaitime/shared-common';

import { usersManager } from '../auth/UsersManager';

export type NotesManagerFindManyByUserIdWithOptions = {
  search?: string;
  sortField?: NotesListSortFieldEnum;
  sortDirection?: SortDirectionEnum;
  includeDeleted?: boolean;
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
    let where = eq(notes.userId, userId);
    let orderBy = desc(notes.createdAt);

    if (options?.search) {
      where = and(ilike(notes.title, `%${options.search}%`)) as SQL<unknown>;
    }

    if (options?.sortField) {
      const direction = options?.sortDirection ?? SortDirectionEnum.ASC;
      const field = notes[options.sortField] ?? notes.title;

      orderBy = direction === SortDirectionEnum.ASC ? asc(field) : desc(field);
    }

    if (!options?.includeDeleted) {
      where = and(where, isNull(notes.deletedAt)) as SQL<unknown>;
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

  // Permissions
  async userCanView(userId: string, noteId: string): Promise<boolean> {
    const row = await getDatabase().query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.userId, userId)),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, noteId: string): Promise<boolean> {
    return this.userCanView(userId, noteId);
  }

  async userCanDelete(userId: string, noteId: string): Promise<boolean> {
    return this.userCanUpdate(userId, noteId);
  }

  // Helpers
  async list(userId: string, options?: NotesManagerFindManyByUserIdWithOptions) {
    return this.findManyByUserIdWithOptions(userId, options);
  }

  async view(userId: string, noteId: string) {
    const canView = await this.userCanView(noteId, userId);
    if (!canView) {
      throw new Error('You cannot view this note');
    }

    const data = await this.findOneByIdAndUserId(noteId, userId);
    if (!data) {
      throw new Error('Note not found');
    }

    return data;
  }

  async create(user: User, data: CreateNote) {
    const notesMaxPerUserCount = await usersManager.getUserLimit(user, 'notesMaxPerUserCount');

    const notesCount = await this.countByUserId(user.id);
    if (notesCount >= notesMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of notes per user (${notesMaxPerUserCount}).`
      );
    }

    return this.insertOne({
      ...data,
      userId: user.id,
    });
  }

  async update(userId: string, noteId: string, updateData: UpdateNote) {
    const canView = await this.userCanUpdate(userId, noteId);
    if (!canView) {
      throw new Error('You cannot update this note');
    }

    const data = await this.findOneById(noteId);
    if (!data) {
      throw new Error('Note not found');
    }

    return this.updateOneById(noteId, updateData);
  }

  async delete(userId: string, noteId: string, isHardDelete?: boolean) {
    const hasAccess = await this.userCanDelete(userId, noteId);
    if (!hasAccess) {
      throw new Error('Note not found');
    }

    return isHardDelete
      ? this.deleteOneById(noteId)
      : this.updateOneById(noteId, {
          deletedAt: new Date(),
        });
  }

  async undelete(userId: string, noteId: string) {
    const canDelete = await notesManager.userCanUpdate(userId, noteId);
    if (!canDelete) {
      throw new Error('You cannot undelete this note');
    }

    return notesManager.updateOneById(noteId, {
      deletedAt: null,
    });
  }

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
}

export const notesManager = new NotesManager();
