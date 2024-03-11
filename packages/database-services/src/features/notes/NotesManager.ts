import { and, asc, count, DBQueryConfig, desc, eq, ilike, isNull, SQL } from 'drizzle-orm';

import {
  getDatabase,
  NewNote,
  Note,
  notes,
  NoteWithoutContent,
  User,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  CreateNote,
  GlobalEventsEnum,
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

  async findOneById(noteId: string): Promise<Note | null> {
    const row = await getDatabase().query.notes.findFirst({
      where: eq(notes.id, noteId),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(noteId: string, userId: string): Promise<Note | null> {
    const row = await getDatabase().query.notes.findFirst({
      where: and(eq(notes.id, noteId), eq(notes.userId, userId)),
    });

    return row ?? null;
  }

  async insertOne(data: NewNote): Promise<Note> {
    const rows = await getDatabase().insert(notes).values(data).returning();

    return rows[0];
  }

  async updateOneById(noteId: string, data: Partial<NewNote>): Promise<Note> {
    const rows = await getDatabase()
      .update(notes)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(notes.id, noteId))
      .returning();

    return rows[0];
  }

  async deleteOneById(noteId: string): Promise<Note> {
    const rows = await getDatabase().delete(notes).where(eq(notes.id, noteId)).returning();

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

  // API Helpers
  async list(actorUserId: string, options?: NotesManagerFindManyByUserIdWithOptions) {
    return this.findManyByUserIdWithOptions(actorUserId, options);
  }

  async view(actorUserId: string, noteId: string) {
    const canView = await this.userCanView(actorUserId, noteId);
    if (!canView) {
      throw new Error('You cannot view this note');
    }

    const data = await this.findOneByIdAndUserId(noteId, actorUserId);
    if (!data) {
      throw new Error('Note not found');
    }

    return data;
  }

  async create(actorUser: User, data: CreateNote) {
    await this._checkIfLimitReached(actorUser);

    const note = await this.insertOne({
      ...data,
      userId: actorUser.id,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.NOTES_NOTE_ADDED, {
      actorUserId: actorUser.id,
      noteId: note.id,
    });

    return note;
  }

  async update(actorUserId: string, noteId: string, data: UpdateNote) {
    const canView = await this.userCanUpdate(actorUserId, noteId);
    if (!canView) {
      throw new Error('You cannot update this note');
    }

    const note = await this.findOneById(noteId);
    if (!note) {
      throw new Error('Note not found');
    }

    const updatedNote = await this.updateOneById(noteId, data);

    globalEventsNotifier.publish(GlobalEventsEnum.NOTES_NOTE_EDITED, {
      actorUserId,
      noteId: updatedNote.id,
    });

    return updatedNote;
  }

  async delete(actorUserId: string, noteId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(actorUserId, noteId);
    if (!canDelete) {
      throw new Error('You cannot delete this note');
    }

    const deletedNote = isHardDelete
      ? await this.deleteOneById(noteId)
      : await this.updateOneById(noteId, {
          deletedAt: new Date(),
        });

    globalEventsNotifier.publish(GlobalEventsEnum.NOTES_NOTE_DELETED, {
      actorUserId,
      noteId: deletedNote.id,
    });

    return deletedNote;
  }

  async undelete(actorUser: User, noteId: string) {
    const canDelete = await notesManager.userCanUpdate(actorUser.id, noteId);
    if (!canDelete) {
      throw new Error('You cannot undelete this note');
    }

    await this._checkIfLimitReached(actorUser);

    const undeletedNote = await notesManager.updateOneById(noteId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.NOTES_NOTE_UNDELETED, {
      actorUserId: actorUser.id,
      noteId: undeletedNote.id,
    });

    return undeletedNote;
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

  // Private
  private async _checkIfLimitReached(actorUser: User) {
    const notesMaxPerUserCount = await usersManager.getUserLimit(actorUser, 'notesMaxPerUserCount');
    const notesCount = await this.countByUserId(actorUser.id);
    if (notesCount >= notesMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of notes per user (${notesMaxPerUserCount}).`
      );
    }
  }
}

export const notesManager = new NotesManager();
