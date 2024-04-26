import { and, asc, count, desc, eq, ilike, inArray, isNull, or, SQL } from 'drizzle-orm';

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
import { userUsageManager } from '../auth/UserUsageManager';

export type NotesManagerFindManyOptions = {
  search?: string;
  sortField?: NotesListSortFieldEnum;
  sortDirection?: SortDirectionEnum;
  includeDeleted?: boolean;
};

export class NotesManager {
  // API Helpers
  async list(actorUserId: string, options?: NotesManagerFindManyOptions) {
    return this.findManyByUserId(actorUserId, options);
  }

  async view(actorUserId: string, noteId: string) {
    const canView = await this.userCanView(actorUserId, noteId);
    if (!canView) {
      throw new Error('You cannot view this note');
    }

    const data = await this.findOneById(noteId);
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
      teamId: note.teamId ?? undefined,
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

    // The reason we need that is, that we still want to broadcast the removal of the note from the team,
    // so their clients get updated
    let unsharedTeamId: string | undefined = undefined;
    if (typeof data.teamId !== 'undefined') {
      const userTeamIds = await usersManager.getTeamIds(actorUserId);
      if (data.teamId && !userTeamIds.includes(data.teamId)) {
        throw new Error('You cannot share the note with this team');
      }

      if (note.teamId && !data.teamId) {
        unsharedTeamId = note.teamId;
      }
    }

    const updatedNote = await this.updateOneById(noteId, data);

    globalEventsNotifier.publish(GlobalEventsEnum.NOTES_NOTE_EDITED, {
      actorUserId,
      noteId: updatedNote.id,
      teamId: unsharedTeamId ?? updatedNote.teamId ?? undefined,
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
      teamId: deletedNote.teamId ?? undefined,
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
      teamId: undeletedNote.teamId ?? undefined,
    });

    return undeletedNote;
  }

  // Permissions
  async userCanView(userId: string, noteId: string): Promise<boolean> {
    const row = await getDatabase().query.notes.findFirst({
      where: eq(notes.id, noteId),
    });

    if (!row) {
      return false;
    }

    if (row.userId === userId) {
      return true;
    }

    const teamIds = await usersManager.getTeamIds(userId);
    if (row.teamId && teamIds.includes(row.teamId)) {
      return true;
    }

    return false;
  }

  async userCanUpdate(userId: string, noteId: string): Promise<boolean> {
    return this.userCanView(userId, noteId);
  }

  async userCanDelete(userId: string, noteId: string): Promise<boolean> {
    return this.userCanUpdate(userId, noteId);
  }

  // Helpers
  async findManyByUserId(
    userId: string,
    options?: NotesManagerFindManyOptions
  ): Promise<NoteWithoutContent[]> {
    let where: SQL<unknown>;
    let orderBy = desc(notes.createdAt);

    const teamIds = await usersManager.getTeamIds(userId);
    if (teamIds.length === 0) {
      where = eq(notes.userId, userId) as SQL<unknown>;
    } else {
      where = or(eq(notes.userId, userId), inArray(notes.teamId, teamIds)) as SQL<unknown>;
    }

    if (options?.search) {
      where = and(where, ilike(notes.title, `%${options.search}%`)) as SQL<unknown>;
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
    const notesMaxPerUserCount = await userUsageManager.getUserLimit(
      actorUser,
      'notesMaxPerUserCount'
    );
    const notesCount = await this.countByUserId(actorUser.id);
    if (notesCount >= notesMaxPerUserCount) {
      throw new Error(
        `You have reached the maximum number of notes per user (${notesMaxPerUserCount}).`
      );
    }
  }
}

export const notesManager = new NotesManager();
