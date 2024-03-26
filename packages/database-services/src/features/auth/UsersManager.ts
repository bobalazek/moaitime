import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  ilike,
  inArray,
  isNotNull,
  isNull,
  lt,
  ne,
  or,
  SQL,
  sum,
} from 'drizzle-orm';
import { PgColumn } from 'drizzle-orm/pg-core';

import { databaseCacheManager } from '@moaitime/database-cache';
import {
  getDatabase,
  NewUser,
  teams,
  teamUsers,
  User,
  userAchievements,
  userBlockedUsers,
  userExperiencePoints,
  userFollowedUsers,
  users,
} from '@moaitime/database-core';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import {
  AchievementsMap,
  CreateReport,
  DEFAULT_USER_SETTINGS,
  EntityTypeEnum,
  GlobalEventsEnum,
  isValidUuid,
  OauthProviderEnum,
  PublicUser,
  PublicUserSchema,
  SortDirectionEnum,
  UserAchievement,
  UserLimits,
  UserSettings,
  UserUsage,
} from '@moaitime/shared-common';

import { calendarsManager } from '../calendars/CalendarsManager';
import { eventsManager } from '../calendars/EventsManager';
import { focusSessionsManager } from '../focus/FocusSessionsManager';
import { habitsManager } from '../habits/HabitsManager';
import { moodEntriesManager } from '../mood/MoodEntriesManager';
import { notesManager } from '../notes/NotesManager';
import { reportsManager } from '../reports/ReportsManager';
import { invitationsManager } from '../social/InvitationsManager';
import { listsManager } from '../tasks/ListsManager';
import { tagsManager } from '../tasks/TagsManager';
import { tasksManager } from '../tasks/TasksManager';
import { userOnlineActivityEntriesManager } from './UserOnlineActivityEntriesManager';

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
  // API Helpers
  async view(actorUserId: string, userIdOrUsername: string): Promise<PublicUser> {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, actorUserId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const parsedUser = PublicUserSchema.parse(user);

    const canViewUserIfPrivate = await this.canViewUserIfPrivate(actorUserId, user);
    const followersCount = canViewUserIfPrivate ? await this.countFollowers(user.id) : 0;
    const followingCount = canViewUserIfPrivate ? await this.countFollowing(user.id) : 0;
    const lastActiveAt = canViewUserIfPrivate
      ? await userOnlineActivityEntriesManager.getLastActiveAtByUserId(user.id)
      : null;
    const experiencePoints = canViewUserIfPrivate
      ? await this.getExperincePointsByUserId(user.id)
      : 0;

    const isMyself = actorUserId === user.id;
    const myselfIsFollowingThisUser = await this.isFollowingUser(actorUserId, user.id);
    const myselfIsFollowedByThisUser = await this.isFollowingUser(user.id, actorUserId);
    const myselfIsBlockingThisUser = await this.isBlockingUser(actorUserId, user.id);

    return {
      ...parsedUser,
      followersCount,
      followingCount,
      lastActiveAt,
      experiencePoints,
      isMyself,
      myselfIsFollowingThisUser,
      myselfIsFollowedByThisUser,
      myselfIsBlockingThisUser,
    };
  }

  async follow(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    if (actorUserId === user.id) {
      throw new Error('You cannot follow yourself.');
    }

    const isBlocked = await this.isBlockingUser(user.id, actorUserId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocking = await this.isBlockingUser(actorUserId, user.id);
    if (isBlocking) {
      throw new Error(`You can not follow a user that you are blocking`);
    }

    const follow = await getDatabase().query.userFollowedUsers.findFirst({
      where: and(
        eq(userFollowedUsers.userId, actorUserId),
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
        userId: actorUserId,
        followedUserId: user.id,
        approvedAt: !user.isPrivate ? new Date() : null,
      })
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to follow this user.');
    }

    // Cache
    await databaseCacheManager.delete(`users:${actorUserId}:isFollowingUser:${user.id}`);
    await databaseCacheManager.delete(`users:${actorUserId}:countFollowing`);
    await databaseCacheManager.delete(`users:${user.id}:countFollowers`);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_FOLLOWED_USER, {
      actorUserId,
      userId: user.id,
      userFollowedUserId: row.id,
      needsApproval: !row.approvedAt,
    });

    return row;
  }

  async unfollow(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, actorUserId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    if (actorUserId === user.id) {
      throw new Error('You cannot unfollow yourself.');
    }

    const isFollowing = await this.isFollowingUser(actorUserId, user.id);
    if (!isFollowing) {
      throw new Error('You are not following this user.');
    }

    const rows = await getDatabase()
      .delete(userFollowedUsers)
      .where(
        and(
          eq(userFollowedUsers.userId, actorUserId),
          eq(userFollowedUsers.followedUserId, user.id)
        )
      )
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to unfollow the user.');
    }

    // Cache
    await databaseCacheManager.delete(`users:${actorUserId}:isFollowingUser:${user.id}`);
    await databaseCacheManager.delete(`users:${actorUserId}:countFollowing`);
    await databaseCacheManager.delete(`users:${user.id}:countFollowers`);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UNFOLLOWED_USER, {
      actorUserId,
      userId: user.id,
      userFollowedUserId: row.id,
    });

    return row;
  }

  async approveFollower(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, actorUserId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isFollowing = await this.isFollowingUser(user.id, actorUserId);
    if (!isFollowing) {
      throw new Error('This user is not following you.');
    }

    const rows = await getDatabase()
      .update(userFollowedUsers)
      .set({ approvedAt: new Date() })
      .where(
        and(
          eq(userFollowedUsers.userId, user.id),
          eq(userFollowedUsers.followedUserId, actorUserId)
        )
      )
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to approve the follower.');
    }

    // Cache
    await databaseCacheManager.delete(`users:${actorUserId}:isFollowingUser:${user.id}`);
    await databaseCacheManager.delete(`users:${actorUserId}:countFollowing`);
    await databaseCacheManager.delete(`users:${user.id}:countFollowers`);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_APPROVE_FOLLOWED_USER, {
      actorUserId,
      userId: user.id,
      userFollowedUserId: row.id,
    });

    return row;
  }

  async removeFollower(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isFollowing = await this.isFollowingUser(user.id, actorUserId);
    if (!isFollowing) {
      throw new Error('This user is not following you.');
    }

    const rows = await getDatabase()
      .delete(userFollowedUsers)
      .where(
        and(
          eq(userFollowedUsers.userId, user.id),
          eq(userFollowedUsers.followedUserId, actorUserId)
        )
      )
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to remove the follower.');
    }

    // Cache
    await databaseCacheManager.delete(`users:${actorUserId}:isFollowingUser:${user.id}`);
    await databaseCacheManager.delete(`users:${actorUserId}:countFollowing`);
    await databaseCacheManager.delete(`users:${user.id}:countFollowers`);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_REMOVE_FOLLOWED_USER, {
      actorUserId,
      userId: user.id,
      userFollowedUserId: row.id,
    });

    return row;
  }

  async block(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, actorUserId);
    if (isBlocked) {
      throw new Error('You are already blocking this user.');
    }

    const rows = await getDatabase()
      .insert(userBlockedUsers)
      .values({
        userId: actorUserId,
        blockedUserId: user.id,
      })
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to block this user.');
    }

    // Remove our follow to that user if present
    await getDatabase()
      .delete(userFollowedUsers)
      .where(
        and(
          eq(userFollowedUsers.userId, actorUserId),
          eq(userFollowedUsers.followedUserId, user.id)
        )
      );

    // Cache
    await databaseCacheManager.delete(`users:${actorUserId}:isFollowingUser:${user.id}`);
    await databaseCacheManager.delete(`users:${actorUserId}:countFollowing`);
    await databaseCacheManager.delete(`users:${user.id}:countFollowers`);
    await databaseCacheManager.delete(`users:${actorUserId}:isBlockingUser:${user.id}`);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_BLOCKED_USER, {
      actorUserId,
      userId: user.id,
      userBlockedUserId: row.id,
    });

    return row;
  }

  async unblock(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocking = await this.isBlockingUser(actorUserId, user.id);
    if (!isBlocking) {
      throw new Error('You are not blocking this user.');
    }

    const rows = await getDatabase()
      .delete(userBlockedUsers)
      .where(
        and(eq(userBlockedUsers.userId, actorUserId), eq(userBlockedUsers.blockedUserId, user.id))
      )
      .returning();
    const row = rows[0];
    if (!row) {
      throw new Error('Failed to unblock this user.');
    }

    // Cache
    await databaseCacheManager.delete(`users:${actorUserId}:isFollowingUser:${user.id}`);
    await databaseCacheManager.delete(`users:${actorUserId}:isBlockingUser:${user.id}`);

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_UNBLOCKED_USER, {
      actorUserId,
      userId: user.id,
      userBlockedUserId: row.id,
    });

    return row;
  }

  async report(actorUserId: string, userIdOrUsername: string, data: CreateReport) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const report = await reportsManager.insertOne({
      userId: actorUserId,
      targetEntity: {
        id: user.id,
        type: EntityTypeEnum.USERS,
      },
      ...data,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.AUTH_USER_REPORTED_USER, {
      actorUserId,
      userId: user.id,
      reportId: report.id,
    });

    return report;
  }

  async search(actorUserId: string, options: UsersManagerSearchOptions) {
    const query = options.query!;
    const limit = options.limit ?? 10;
    const sortDirection = options.sortDirection ?? SortDirectionEnum.DESC;

    const isSortAscending = sortDirection === SortDirectionEnum.ASC;

    let orderWasReversed = false;
    let orderBy = isSortAscending ? asc(users.createdAt) : desc(users.createdAt);
    let where = or(ilike(users.username, `%${query}%`), ilike(users.displayName, `%${query}%`));

    if (options?.previousCursor) {
      const { id: previousId, createdAt: previousCreatedAt } = this._cursorToProperties(
        options.previousCursor
      );
      const previousCreatedAtDate = new Date(previousCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? lt(users.createdAt, previousCreatedAtDate)
            : gt(users.createdAt, previousCreatedAtDate),
          and(eq(users.createdAt, previousCreatedAtDate), ne(users.id, previousId))
        )
      ) as SQL<unknown>;

      // If we are going backwards, we need to reverse the order so we do not miss any entries in the middle
      orderBy = isSortAscending ? desc(users.createdAt) : asc(users.createdAt);
      orderWasReversed = true;
    }

    if (options?.nextCursor) {
      const { id: nextId, createdAt: nextCreatedAt } = this._cursorToProperties(options.nextCursor);
      const nextCreatedAtDate = new Date(nextCreatedAt);

      where = and(
        where,
        or(
          isSortAscending
            ? gt(users.createdAt, nextCreatedAtDate)
            : lt(users.createdAt, nextCreatedAtDate),
          and(eq(users.createdAt, nextCreatedAtDate), ne(users.id, nextId))
        )
      ) as SQL<unknown>;
    }

    const rows = await getDatabase().query.users.findMany({
      where,
      orderBy,
      limit,
    });

    // Here we reverse the order back to what it was originally
    if (orderWasReversed) {
      rows.reverse();
    }

    const parsedRows = rows.map((row) => {
      return PublicUserSchema.parse(row);
    });

    const data = await this._populatePublicUsers(parsedRows, actorUserId);

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

  async followers(
    actorUserId: string,
    userIdOrUsername: string,
    options: UsersManagerFollowOptions
  ) {
    return this._getFollowUsers('followers', actorUserId, userIdOrUsername, options);
  }

  async following(
    actorUserId: string,
    userIdOrUsername: string,
    options: UsersManagerFollowOptions
  ) {
    return this._getFollowUsers('following', actorUserId, userIdOrUsername, options);
  }

  async followRequests(
    actorUserId: string,
    userIdOrUsername: string,
    options: UsersManagerFollowOptions
  ) {
    return this._getFollowUsers('follow-requests', actorUserId, userIdOrUsername, options);
  }

  async achievements(actorUserId: string, userIdOrUsername: string) {
    const user = await this.findOneByIdOrUsername(userIdOrUsername);
    if (!user) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const isBlocked = await this.isBlockingUser(user.id, actorUserId);
    if (isBlocked) {
      throw new Error(`User with username or ID "${userIdOrUsername}" was not found.`);
    }

    const canViewUserIfPrivate = await this.canViewUserIfPrivate(actorUserId, user);
    if (!canViewUserIfPrivate) {
      throw new Error('This user is private.');
    }

    const userAchievementEntries = await getDatabase().query.userAchievements.findMany({
      where: eq(userAchievements.userId, user.id),
      orderBy: desc(userAchievements.updatedAt),
    });

    const data: UserAchievement[] = [];

    for (const achievementEntry of userAchievementEntries) {
      const achievement = AchievementsMap.get(achievementEntry.achievementKey);
      if (!achievement) {
        continue;
      }

      const points = achievementEntry.points;
      let level = 0;
      let currentLevelPoints = 0;
      let nextLevelPoints = Infinity;
      let nextLevelProgressPercentage = 0;

      for (let i = 0; i < achievement.levelPoints.length; i++) {
        const levelPoints = achievement.levelPoints[i];
        if (points < levelPoints) {
          break;
        }

        level = i + 1;
        currentLevelPoints = levelPoints;
        if (i + 1 < achievement.levelPoints.length) {
          nextLevelPoints = achievement.levelPoints[i + 1];
          nextLevelProgressPercentage = Math.floor(
            ((points - levelPoints) / (nextLevelPoints - levelPoints)) * 100
          );
        } else {
          nextLevelPoints = levelPoints;
          nextLevelProgressPercentage = 100;

          break;
        }
      }

      data.push({
        key: achievement.key,
        name: achievement.name,
        description: achievement.description,
        points,
        level,
        currentLevelPoints,
        nextLevelPoints: nextLevelPoints === Infinity ? currentLevelPoints : nextLevelPoints,
        nextLevelProgressPercentage,
        hasReachedMaxProgress: nextLevelProgressPercentage === 100,
      });
    }

    return data;
  }

  // Permissions
  async canViewUserIfPrivate(userId: string, user: User) {
    const isMyself = userId === user.id;
    const isFollowing = await this.isFollowingUser(userId, user.id);
    if (!isMyself && user.isPrivate && isFollowing !== true) {
      return false;
    }

    return true;
  }

  // Helpers
  async findManyByEmails(emails: string[]): Promise<User[]> {
    const rows = await getDatabase().query.users.findMany({
      where: inArray(users.email, emails),
    });

    return rows;
  }

  async findManyByUserIds(userIds: string[]): Promise<User[]> {
    if (userIds.length === 0) {
      return [];
    }

    const rows = await getDatabase().query.users.findMany({
      where: inArray(users.id, userIds),
    });

    return rows;
  }

  async findOneById(userId: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!row) {
      return null;
    }

    return row;
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

    return row;
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.username, username),
    });

    if (!row) {
      return null;
    }

    return row;
  }

  async findOneByEmailConfirmationToken(emailConfirmationToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.emailConfirmationToken, emailConfirmationToken),
    });

    if (!row) {
      return null;
    }

    return row;
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

    return row;
  }

  async findOneByPasswordResetToken(passwordResetToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.passwordResetToken, passwordResetToken),
    });

    if (!row) {
      return null;
    }

    return row;
  }

  async findOneByDeletionToken(deletionToken: string): Promise<User | null> {
    const row = await getDatabase().query.users.findFirst({
      where: eq(users.deletionToken, deletionToken),
    });

    if (!row) {
      return null;
    }

    return row;
  }

  async findOneByOauthProviderId(
    provider: OauthProviderEnum,
    oauthSub: string
  ): Promise<User | null> {
    let field: PgColumn | null = null;
    if (provider === OauthProviderEnum.GOOGLE) {
      field = users.oauthGoogleId;
    }

    if (!field) {
      return null;
    }

    const row = await getDatabase().query.users.findFirst({
      where: eq(field, oauthSub),
    });

    if (!row) {
      return null;
    }

    return row;
  }

  async insertOne(data: NewUser): Promise<User> {
    const rows = await getDatabase().insert(users).values(data).returning();

    return rows[0] ?? null;
  }

  async updateOneById(userId: string, data: Partial<NewUser>): Promise<User> {
    const rows = await getDatabase()
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();

    return rows[0] ?? null;
  }

  async deleteOneById(userId: string): Promise<User> {
    const rows = await getDatabase().delete(users).where(eq(users.id, userId)).returning();

    return rows[0] ?? null;
  }

  async isBlockingUser(userId: string, blockedUserId: string) {
    const cacheKey = `users:${userId}:isBlockingUser:${blockedUserId}`;
    const cachedValue = await databaseCacheManager.get<boolean>(cacheKey);
    if (typeof cachedValue !== 'undefined') {
      return cachedValue;
    }

    const block = await getDatabase().query.userBlockedUsers.findFirst({
      where: and(
        eq(userBlockedUsers.userId, userId),
        eq(userBlockedUsers.blockedUserId, blockedUserId)
      ),
    });
    const result = !!block;

    await databaseCacheManager.set(cacheKey, result, 3600);

    return result;
  }

  async isFollowingUser(userId: string, followedUserId: string) {
    const cacheKey = `users:${userId}:isFollowingUser:${followedUserId}`;
    const cachedValue = await databaseCacheManager.get<boolean>(cacheKey);
    if (typeof cachedValue !== 'undefined') {
      return cachedValue;
    }

    const follow = await getDatabase().query.userFollowedUsers.findFirst({
      where: and(
        eq(userFollowedUsers.userId, userId),
        eq(userFollowedUsers.followedUserId, followedUserId)
      ),
    });

    let result: boolean | 'pending' = false;
    if (follow) {
      result = follow.approvedAt ? true : 'pending';
    }

    await databaseCacheManager.set(cacheKey, result, 3600);

    return result;
  }

  async countFollowers(userId: string): Promise<number> {
    const cacheKey = `users:${userId}:countFollowers`;
    const cachedValue = await databaseCacheManager.get<number>(cacheKey);
    if (typeof cachedValue !== 'undefined') {
      return cachedValue;
    }

    const rows = await getDatabase()
      .select({
        count: count(userFollowedUsers.id).mapWith(Number),
      })
      .from(userFollowedUsers)
      .where(
        and(eq(userFollowedUsers.followedUserId, userId), isNotNull(userFollowedUsers.approvedAt))
      )
      .execute();
    const result = rows[0].count ?? 0;

    await databaseCacheManager.set(cacheKey, result, 3600);

    return result;
  }

  async countFollowing(userId: string): Promise<number> {
    const cacheKey = `users:${userId}:countFollowing`;
    const cachedValue = await databaseCacheManager.get<number>(cacheKey);
    if (typeof cachedValue !== 'undefined') {
      return cachedValue;
    }

    const rows = await getDatabase()
      .select({
        count: count(userFollowedUsers.id).mapWith(Number),
      })
      .from(userFollowedUsers)
      .where(and(eq(userFollowedUsers.userId, userId), isNotNull(userFollowedUsers.approvedAt)))
      .execute();
    const result = rows[0].count ?? 0;

    await databaseCacheManager.set(cacheKey, result, 3600);

    return result;
  }

  async countByTeamId(teamId: string): Promise<number> {
    const rows = await getDatabase()
      .select({
        count: count(teamUsers.id).mapWith(Number),
      })
      .from(teamUsers)
      .where(eq(teamUsers.teamId, teamId))
      .execute();

    return rows[0].count ?? 0;
  }

  async getUserFollowedUserById(userFollowedUserId: string) {
    const row = await getDatabase().query.userFollowedUsers.findFirst({
      where: eq(userFollowedUsers.id, userFollowedUserId),
    });

    return row ?? null;
  }

  async getExperincePointsByUserId(userId: string): Promise<number> {
    // TODO: absolutely cache this

    const result = await getDatabase()
      .select({
        experiencePoints: sum(userExperiencePoints.amount).mapWith(Number),
      })
      .from(userExperiencePoints)
      .where(eq(userExperiencePoints.userId, userId))
      .execute();

    return result[0].experiencePoints ?? 0;
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
      habitsMaxPerUserCount: 5,
      calendarsMaxPerUserCount: 5,
      calendarsMaxEventsPerCalendarCount: 1000,
      calendarsMaxUserCalendarsPerUserCount: 3,
      notesMaxPerUserCount: 25,
      userInvitationsMaxPerUserCount: 10,
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
    const tagsCount = await tagsManager.countByUserId(user.id);
    const habitsCount = await habitsManager.countByUserId(user.id);
    const notesCount = await notesManager.countByUserId(user.id);
    const moodEntriesCount = await moodEntriesManager.countByUserId(user.id);
    const calendarsCount = await calendarsManager.countByUserId(user.id);
    const userCalendarsCount = await calendarsManager.countUserCalendarsByUserId(user.id);
    const eventsCount = await eventsManager.countByUserId(user.id);
    const focusSessionsCount = await focusSessionsManager.countByUserId(user.id);
    const userInvitationsCount = await invitationsManager.countByUserId(user.id);

    return {
      listsCount,
      tasksCount,
      tagsCount,
      habitsCount,
      notesCount,
      moodEntriesCount,
      calendarsCount,
      userCalendarsCount,
      eventsCount,
      focusSessionsCount,
      userInvitationsCount,
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

  private _propertiesToCursor(properties: { id: string; createdAt: string }): string {
    return btoa(JSON.stringify(properties));
  }

  private _cursorToProperties(cursor: string): { id: string; createdAt: string } {
    return JSON.parse(atob(cursor));
  }
}

export const usersManager = new UsersManager();
