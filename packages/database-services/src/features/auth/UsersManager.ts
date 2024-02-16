import { format } from 'date-fns';
import {
  and,
  asc,
  count,
  DBQueryConfig,
  desc,
  eq,
  gt,
  inArray,
  isNotNull,
  isNull,
  lt,
  ne,
  or,
  SQL,
} from 'drizzle-orm';

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
  SortDirectionEnum,
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

export type UsersManagerFollowOptions = {
  limit: number;
  sortDirection?: SortDirectionEnum;
  previousCursor?: string;
  nextCursor?: string;
};

export type UsersManagerSearchOptions = UsersManagerFollowOptions & {
  query?: string;
};

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

    const followersCount = await this.countFollowers(user.id);
    const followingCount = await this.countFollowing(user.id);
    const lastActiveAt = await userActivityEntriesManager.getLastActiveAtByUserId(user.id);

    const isMyself = userId === user.id;
    const myselfIsFollowingThisUser = await this.isFollowingUser(userId, user.id);
    const myselfIsFollowedByThisUser = await this.isFollowingUser(user.id, userId);
    const myselfIsBlockingThisUser = await this.isBlockingUser(userId, user.id);

    return {
      ...parsedUser,
      followersCount,
      followingCount,
      lastActiveAt: lastActiveAt ? lastActiveAt.toISOString() : null,
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

  async approveFollower(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isFollowing = await this.isFollowingUser(user.id, userId);
    if (!isFollowing) {
      throw new Error('This user is not following you.');
    }

    const rows = await getDatabase()
      .update(userFollowedUsers)
      .set({ approvedAt: new Date() })
      .where(
        and(eq(userFollowedUsers.userId, user.id), eq(userFollowedUsers.followedUserId, userId))
      )
      .returning();

    return rows[0];
  }

  async removeFollower(userId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isFollowing = await this.isFollowingUser(user.id, userId);
    if (!isFollowing) {
      throw new Error('This user is not following you.');
    }

    const rows = await getDatabase()
      .delete(userFollowedUsers)
      .where(
        and(eq(userFollowedUsers.userId, user.id), eq(userFollowedUsers.followedUserId, userId))
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

  async search(userId: string, options: UsersManagerSearchOptions) {
    // TODO

    return {
      data: [],
      meta: {
        previousCursor: undefined,
        nextCursor: undefined,
        sortDirection: options.sortDirection ?? SortDirectionEnum.DESC,
        limit: options.limit,
      },
    };
  }

  async followers(userId: string, userIdOrUsername: string, options: UsersManagerFollowOptions) {
    return this._getFollowUsers('followers', userId, userIdOrUsername, options);
  }

  async following(userId: string, userIdOrUsername: string, options: UsersManagerFollowOptions) {
    return this._getFollowUsers('following', userId, userIdOrUsername, options);
  }

  async followRequests(
    userId: string,
    userIdOrUsername: string,
    options: UsersManagerFollowOptions
  ) {
    return this._getFollowUsers('follow-requests', userId, userIdOrUsername, options);
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

  async canViewUserIfPrivate(userId: string, user: User) {
    const isMyself = userId === user.id;
    const isFollowing = await this.isFollowingUser(userId, user.id);
    if (!isMyself && user.isPrivate && isFollowing !== true) {
      return false;
    }

    return true;
  }

  async countFollowers(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userFollowedUsers.id).mapWith(Number),
      })
      .from(userFollowedUsers)
      .where(
        and(eq(userFollowedUsers.followedUserId, userId), isNotNull(userFollowedUsers.approvedAt))
      )
      .execute();

    return result[0].count ?? 0;
  }

  async countFollowing(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(userFollowedUsers.id).mapWith(Number),
      })
      .from(userFollowedUsers)
      .where(and(eq(userFollowedUsers.userId, userId), isNotNull(userFollowedUsers.approvedAt)))
      .execute();

    return result[0].count ?? 0;
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
  private async _getFollowUsers(
    type: 'followers' | 'following' | 'follow-requests',
    userId: string,
    userIdOrUsername: string,
    options: UsersManagerFollowOptions
  ) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isMyself = userId === user.id;
    if (type === 'follow-requests' && !isMyself) {
      throw new Error('You cannot see follow requests of other users.');
    }

    const isBlocked = await this.isBlockingUser(user.id, userId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const limit = options?.limit ?? 20;
    const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;

    const canViewUserIfPrivate = await this.canViewUserIfPrivate(userId, user);
    if (!canViewUserIfPrivate) {
      throw new Error('This user is private.');
    }

    const isSortAscending = sortDirection === SortDirectionEnum.ASC;

    let orderWasReversed = false;
    let orderBy = isSortAscending
      ? asc(userFollowedUsers.createdAt)
      : desc(userFollowedUsers.createdAt);
    let where: SQL<unknown> | undefined;

    if (type === 'following') {
      where = and(eq(userFollowedUsers.userId, user.id), isNotNull(userFollowedUsers.approvedAt));
    } else if (type === 'followers') {
      where = and(
        eq(userFollowedUsers.followedUserId, user.id),
        isNotNull(userFollowedUsers.approvedAt)
      );
    } else if (type === 'follow-requests') {
      where = and(
        eq(userFollowedUsers.followedUserId, user.id),
        isNull(userFollowedUsers.approvedAt)
      );
    }

    if (!where) {
      throw new Error('Invalid type.');
    }

    if (options?.previousCursor) {
      const { id: previousId, createdAt: previousCreatedAt } = this._cursorToProperties(
        options.previousCursor
      );
      const previousCreatedAtDate = new Date(previousCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? lt(userFollowedUsers.createdAt, previousCreatedAtDate)
            : gt(userFollowedUsers.createdAt, previousCreatedAtDate),
          and(
            eq(userFollowedUsers.createdAt, previousCreatedAtDate),
            ne(userFollowedUsers.id, previousId)
          )
        )
      ) as SQL<unknown>;

      // If we are going backwards, we need to reverse the order so we do not miss any entries in the middle
      orderBy = isSortAscending
        ? desc(userFollowedUsers.createdAt)
        : asc(userFollowedUsers.createdAt);
      orderWasReversed = true;
    }

    if (options?.nextCursor) {
      const { id: nextId, createdAt: nextCreatedAt } = this._cursorToProperties(options.nextCursor);
      const nextCreatedAtDate = new Date(nextCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? gt(userFollowedUsers.createdAt, nextCreatedAtDate)
            : lt(userFollowedUsers.createdAt, nextCreatedAtDate),
          and(eq(userFollowedUsers.createdAt, nextCreatedAtDate), ne(userFollowedUsers.id, nextId))
        )
      ) as SQL<unknown>;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let withObj: any;
    if (type === 'following') {
      withObj = {
        followedUser: true,
      };
    } else if (type === 'followers' || type === 'follow-requests') {
      withObj = {
        user: true,
      };
    }

    const rows = await getDatabase().query.userFollowedUsers.findMany({
      where,
      orderBy,
      limit,
      with: withObj,
    });

    // Here we reverse the order back to what it was originally
    if (orderWasReversed) {
      rows.reverse();
    }

    const parsedRows = rows
      .map((row) => {
        if ('followedUser' in row) {
          return PublicUserSchema.parse(row.followedUser);
        } else if ('user' in row) {
          return PublicUserSchema.parse(row.user);
        }

        return null;
      })
      .filter((user) => {
        return !!user;
      }) as PublicUser[];

    const data = await this._populatePublicUsers(parsedRows, userId);

    let previousCursor: string | undefined;
    let nextCursor: string | undefined;
    if (data.length > 0) {
      const isLessThanLimit = data.length < limit;
      const firstItem = data[0];
      const lastItem = data[data.length - 1];

      previousCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: firstItem.id,
            createdAt: firstItem.createdAt,
          })
        : undefined;
      nextCursor = !isLessThanLimit
        ? this._propertiesToCursor({
            id: lastItem.id,
            createdAt: lastItem.createdAt,
          })
        : undefined;
    }

    if (!options?.previousCursor) {
      // Since no previousCursor was provided by the request,
      // we assume that this is the very first page, and because of that,
      // we certainly have no previous entries.
      previousCursor = undefined;
    }

    return {
      data,
      meta: {
        previousCursor,
        nextCursor,
        sortDirection,
        limit,
      },
    };
  }

  private async _populatePublicUsers(rows: PublicUser[], userId: string) {
    if (rows.length === 0) {
      return [];
    }

    const userIds = rows.map((row) => {
      return row.id;
    });

    const myselfFollowingUsersFromBatch = await getDatabase().query.userFollowedUsers.findMany({
      where: and(
        eq(userFollowedUsers.userId, userId),
        inArray(userFollowedUsers.followedUserId, userIds)
      ),
    });
    const myselfFollowingUsersFromBatchMap = new Map(
      myselfFollowingUsersFromBatch.map((userFollower) => {
        return [userFollower.followedUserId, userFollower];
      })
    );

    const myselfFollowedUsersFromBatchRows = await getDatabase().query.userFollowedUsers.findMany({
      where: and(
        eq(userFollowedUsers.followedUserId, userId),
        inArray(userFollowedUsers.userId, userIds)
      ),
    });
    const myselfFollowedUsersFromBatchMap = new Map(
      myselfFollowedUsersFromBatchRows.map((userFollower) => {
        return [userFollower.followedUserId, userFollower];
      })
    );

    const userBlockedUsersRows = await getDatabase().query.userBlockedUsers.findMany({
      where: and(
        eq(userBlockedUsers.userId, userId),
        inArray(userBlockedUsers.blockedUserId, userIds)
      ),
    });
    const userBlockedUsersMap = new Map(
      userBlockedUsersRows.map((userBlocked) => {
        return [userBlocked.blockedUserId, userBlocked];
      })
    );

    return rows.map((user) => {
      const isMyself = userId === user.id;
      const myselfIsFollowingThisUser = myselfFollowingUsersFromBatchMap.has(user.id)
        ? myselfFollowingUsersFromBatchMap.get(user.id)?.approvedAt
          ? true
          : 'pending'
        : false;
      const myselfIsFollowedByThisUser = myselfFollowedUsersFromBatchMap.has(userId)
        ? myselfFollowedUsersFromBatchMap.get(userId)?.approvedAt
          ? true
          : 'pending'
        : false;
      const myselfIsBlockingThisUser = userBlockedUsersMap.has(user.id);

      return {
        ...user,
        isMyself,
        myselfIsFollowingThisUser,
        myselfIsFollowedByThisUser,
        myselfIsBlockingThisUser,
      };
    });
  }

  private _fixRowColumns(user: User) {
    // TODO
    // Bug in drizzle: https://github.com/drizzle-team/drizzle-orm/issues/1185.
    // Should actually be a string
    if (user.birthDate && (user.birthDate as unknown as Date) instanceof Date) {
      user.birthDate = format(user.birthDate as unknown as Date, 'yyyy-MM-dd');
    }

    return user;
  }

  private _propertiesToCursor(properties: { id: string; createdAt: string }): string {
    return btoa(JSON.stringify(properties));
  }

  private _cursorToProperties(cursor: string): { id: string; createdAt: string } {
    return JSON.parse(atob(cursor));
  }
}

export const usersManager = new UsersManager();
