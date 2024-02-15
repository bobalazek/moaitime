import { format } from 'date-fns';
import { and, count, DBQueryConfig, eq, isNull } from 'drizzle-orm';

import {
  getDatabase,
  NewUser,
  teams,
  teamUsers,
  User,
  userBlockedUsers,
  userFollowedUsers,
  users,
} from '@moaitime/database-core';
import {
  DEFAULT_USER_SETTINGS,
  isValidUuid,
  PublicUser,
  PublicUserSchema,
  UserLimits,
  UserSettings,
  UserUsage,
} from '@moaitime/shared-common';

import { calendarsManager } from '../calendars/CalendarsManager';
import { eventsManager } from '../calendars/EventsManager';
import { focusSessionsManager } from '../focus/FocusSessionsManager';
import { moodEntriesManager } from '../mood/MoodEntriesManager';
import { notesManager } from '../notes/NotesManager';
import { listsManager } from '../tasks/ListsManager';
import { tagsManager } from '../tasks/TagsManager';
import { tasksManager } from '../tasks/TasksManager';
import { userActivityEntriesManager } from './UserActivityEntriesManager';

export class UsersManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<User[]> {
    const rows = await getDatabase().query.users.findMany(options);

    return rows.map((row) => {
      return this._fixRowColumns(row);
    });
  }

  async findOneById(id: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.id, id),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByIdOrUsername(idOrUsername: string): Promise<User | null> {
    if (isValidUuid(idOrUsername)) {
      return this.findOneById(idOrUsername);
    }

    return this.findOneByUsername(idOrUsername);
  }

  async findOneByEmail(email: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByEmailConfirmationToken(emailConfirmationToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.emailConfirmationToken, emailConfirmationToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByNewEmailConfirmationToken(
    newEmailConfirmationToken: string
  ): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.newEmailConfirmationToken, newEmailConfirmationToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByPasswordResetToken(passwordResetToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.passwordResetToken, passwordResetToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async findOneByDeletionToken(deletionToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.deletionToken, deletionToken),
    });

    if (!row) {
      return null;
    }

    return this._fixRowColumns(row);
  }

  async insertOne(data: NewUser): Promise<User> {
    const rows = await getDatabase().insert(users).values(data).returning();

    return this._fixRowColumns(rows[0]);
  }

  async updateOneById(id: string, data: Partial<NewUser>): Promise<User> {
    const rows = await getDatabase()
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();

    return this._fixRowColumns(rows[0]);
  }

  async deleteOneById(id: string): Promise<User> {
    const rows = await getDatabase().delete(users).where(eq(users.id, id)).returning();

    return this._fixRowColumns(rows[0]);
  }

  // API Helpers
  async view(userId: string, userIdOrUsername: string): Promise<PublicUser> {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const parsedUser = PublicUserSchema.parse(user);

    const isMyself = userId === user.id;
    const myselfIsFollowingThisUser = await this.isFollowingUser(userId, user.id);
    const myselfIsFollowedByThisUser = await this.isFollowingUser(user.id, userId);
    const myselfIsBlockingThisUser = await this.isBlockingUser(userId, user.id);

    return {
      ...parsedUser,
      isMyself,
      myselfIsFollowingThisUser,
      myselfIsFollowedByThisUser,
      myselfIsBlockingThisUser,
    };
  }

  async follow(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    if (userId === user.id) {
      throw new Error('You cannot follow yourself.');
    }

    const follow = await getDatabase().query.userFollowedUsers.findFirst({
      where: and(
        eq(userFollowedUsers.userId, userId),
        eq(userFollowedUsers.followedUserId, user.id)
      ),
    });
    if (follow) {
      throw new Error(
        follow.approvedAt
          ? 'You are already following this user.'
          : 'You are already waiting for this user to approve your request.'
      );
    }

    const rows = await getDatabase()
      .insert(userFollowedUsers)
      .values({
        userId,
        followedUserId: user.id,
        approvedAt: user.isPrivate ? null : new Date(),
      });

    return rows[0];
  }

  async unfollow(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    if (userId === user.id) {
      throw new Error('You cannot unfollow yourself.');
    }

    const isFollowing = await this.isFollowingUser(userId, user.id);
    if (!isFollowing) {
      throw new Error('You are not following this user.');
    }

    const rows = await getDatabase()
      .delete(userFollowedUsers)
      .where(
        and(eq(userFollowedUsers.userId, userId), eq(userFollowedUsers.followedUserId, user.id))
      );

    return rows[0];
  }

  async block(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error('You are already blocking this user.');
    }

    const rows = await getDatabase().insert(userBlockedUsers).values({
      userId,
      blockedUserId: user.id,
    });

    return rows[0];
  }

  async unblock(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocking = await this.isBlockingUser(userId, user.id);
    if (!isBlocking) {
      throw new Error('You are not blocking this user.');
    }

    const rows = await getDatabase()
      .delete(userBlockedUsers)
      .where(and(eq(userBlockedUsers.userId, userId), eq(userBlockedUsers.blockedUserId, user.id)));

    return rows[0];
  }

  async lastActive(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const data = await userActivityEntriesManager.getLastActiveAtByUserId(user.id);

    return {
      lastActiveAt: data ?? null,
    };
  }

  // Helpers
  async isBlockingUser(userId: string, blockedUserId: string) {
    const isBeingBlocked = await getDatabase().query.userBlockedUsers.findFirst({
      where: and(
        eq(userBlockedUsers.userId, userId),
        eq(userBlockedUsers.blockedUserId, blockedUserId)
      ),
    });

    return !!isBeingBlocked;
  }

  async isFollowingUser(userId: string, followedUserId: string) {
    const follow = await getDatabase().query.userFollowedUsers.findFirst({
      where: and(
        eq(userFollowedUsers.userId, userId),
        eq(userFollowedUsers.followedUserId, followedUserId)
      ),
    });
    if (!follow) {
      return false;
    }

    return follow?.approvedAt ? true : 'pending';
  }

  async countByTeamId(teamId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(teamUsers.id).mapWith(Number),
      })
      .from(teamUsers)
      .where(eq(teamUsers.teamId, teamId))
      .execute();

    return result[0].count ?? 0;
  }

  async getTeamIds(userId: string): Promise<string[]> {
    // TODO: cache this, we must.

    const rows = await getDatabase()
      .select()
      .from(teamUsers)
      .leftJoin(teams, eq(teams.id, teamUsers.teamId))
      .where(and(eq(teamUsers.userId, userId), isNull(teams.deletedAt)))
      .execute();

    return rows.map((row) => {
      return row.team_users.teamId;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserLimits(user: User): Promise<UserLimits> {
    // TODO: once we have plans, we need to adjust the limits depending on that

    return {
      teamsMaxPerUserCount: 1,
      tasksMaxPerListCount: 25,
      listsMaxPerUserCount: 10,
      tagsMaxPerUserCount: 10,
      calendarsMaxPerUserCount: 5,
      calendarsMaxEventsPerCalendarCount: 1000,
      calendarsMaxUserCalendarsPerUserCount: 3,
      notesMaxPerUserCount: 25,
    };
  }

  async getUserLimit(user: User, key: keyof UserLimits): Promise<number> {
    const limits = await this.getUserLimits(user);

    return limits[key];
  }

  async getUserUsage(user: User): Promise<UserUsage> {
    // TODO: cache!

    const listsCount = await listsManager.countByUserId(user.id);
    const tasksCount = await tasksManager.countByUserId(user.id);
    const notesCount = await notesManager.countByUserId(user.id);
    const moodEntriesCount = await moodEntriesManager.countByUserId(user.id);
    const calendarsCount = await calendarsManager.countByUserId(user.id);
    const userCalendarsCount = await calendarsManager.countUserCalendarsByUserId(user.id);
    const eventsCount = await eventsManager.countByUserId(user.id);
    const tagsCount = await tagsManager.countByUserId(user.id);
    const focusSessionsCount = await focusSessionsManager.countByUserId(user.id);

    return {
      listsCount,
      tasksCount,
      notesCount,
      moodEntriesCount,
      calendarsCount,
      userCalendarsCount,
      eventsCount,
      tagsCount,
      focusSessionsCount,
    };
  }

  getUserSettings(user: User): UserSettings {
    return {
      ...DEFAULT_USER_SETTINGS,
      ...(user.settings ?? {}),
    };
  }

  // Private
  private _fixRowColumns(user: User) {
    // TODO
    // Bug in drizzle: https://github.com/drizzle-team/drizzle-orm/issues/1185.
    // Should actually be a string
    if (user.birthDate && (user.birthDate as unknown as Date) instanceof Date) {
      user.birthDate = format(user.birthDate as unknown as Date, 'yyyy-MM-dd');
    }

    return user;
  }
}

export const usersManager = new UsersManager();
