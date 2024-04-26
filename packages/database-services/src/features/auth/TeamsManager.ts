import { addDays } from 'date-fns';
import { and, count, desc, eq, gt, isNull, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { v4 as uuidv4 } from 'uuid';

import {
  getDatabase,
  lists,
  NewTeam,
  tags,
  taskTags,
  Team,
  teams,
  TeamUser,
  TeamUserInvitation,
  teamUserInvitations,
  teamUsers,
  User,
  users,
} from '@moaitime/database-core';
import { mailer } from '@moaitime/emails-mailer';
import { globalEventsNotifier } from '@moaitime/global-events-notifier';
import { getEnv } from '@moaitime/shared-backend';
import {
  Team as ApiTeam,
  GlobalEventsEnum,
  TeamUserRoleEnum,
  UpdateTeam,
  UpdateTeamUser,
} from '@moaitime/shared-common';

import { usersManager, UsersManager } from './UsersManager';
import { userUsageManager, UserUsageManager } from './UserUsageManager';

export class TeamsManager {
  constructor(
    private _usersManager: UsersManager,
    private _userUsageManager: UserUsageManager
  ) {}

  // API Helpers
  async list(actorUserId: string) {
    return this.findManyByUserId(actorUserId);
  }

  async update(actorUserId: string, teamId: string, data: UpdateTeam) {
    const canView = await this.userCanUpdate(actorUserId, teamId);
    if (!canView) {
      throw new Error('You cannot update this team');
    }

    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const updatedTeam = await this.updateOneById(teamId, data);

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_EDITED, {
      actorUserId,
      teamId,
    });

    return updatedTeam;
  }

  async delete(
    actorUserId: string,
    teamId: string,
    isHardDelete?: boolean,
    skipDeleteCheck?: boolean
  ) {
    // We need the skip delete check here, because in instances of leaving a team, we actually already remove the team members from the team,
    // so we wouldn't really be able to delete the team if we didn't skip the delete check.
    const canDelete = await this.userCanDelete(actorUserId, teamId);
    if (!canDelete && !skipDeleteCheck) {
      throw new Error('You cannot delete this team');
    }

    const team = isHardDelete
      ? await this.deleteOneById(teamId)
      : await this.updateOneById(teamId, {
          deletedAt: new Date(),
        });

    await getDatabase().transaction(async (trx) => {
      // Just give the list to the user that created the list
      trx.update(lists).set({ teamId: null }).where(eq(lists.teamId, teamId));

      // Same for tags, but here we delete the tags from all tasks before
      trx.delete(taskTags).where(eq(taskTags.tagId, tags.id));
      trx.update(tags).set({ teamId: null }).where(eq(tags.teamId, teamId));
    });

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_DELETED, {
      actorUserId,
      teamId: team.id,
    });

    return team;
  }

  async undelete(actorUserId: string, teamId: string) {
    const canDelete = await this.userCanUpdate(actorUserId, teamId);
    if (!canDelete) {
      throw new Error('You cannot undelete this team');
    }

    const team = await this.updateOneById(teamId, {
      deletedAt: null,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_UNDELETED, {
      actorUserId,
      teamId: team.id,
    });

    return team;
  }

  async createAndJoin(
    actorUser: User,
    teamName: string
  ): Promise<{ team: Team; teamUser: TeamUser }> {
    const maxCount = await this._userUsageManager.getUserLimit(actorUser, 'teamsMaxPerUserCount');
    const currentCount = await this.countByUserId(actorUser.id);
    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of teams per user (${maxCount}).`);
    }

    const team = await this.insertOne({
      name: teamName,
      userId: actorUser.id,
    });

    const teamUserRows = await getDatabase()
      .insert(teamUsers)
      .values({
        teamId: team.id,
        userId: actorUser.id,
        roles: [TeamUserRoleEnum.OWNER],
      })
      .returning();
    const row = teamUserRows[0] ?? null;
    if (!row) {
      throw new Error('Failed to join the team. Please try again.');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_ADDED, {
      actorUserId: actorUser.id,
      teamId: team.id,
    });

    return {
      team,
      teamUser: row,
    };
  }

  async leave(actorUserId: string, teamId: string) {
    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const teamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, actorUserId), eq(teamUsers.teamId, teamId)),
    });
    if (!teamUser) {
      throw new Error('You are not a member of this team');
    }

    const isOwner = teamUser.roles.includes(TeamUserRoleEnum.OWNER);

    const allTeamUsers = await getDatabase().query.teamUsers.findMany({
      where: and(eq(teamUsers.teamId, teamId)),
    });

    if (isOwner && allTeamUsers.length > 1) {
      throw new Error(
        'You will first you need to remove all the existing team members from the team before you can leave.'
      );
    }

    const rows = await getDatabase()
      .delete(teamUsers)
      .where(and(eq(teamUsers.userId, actorUserId), eq(teamUsers.teamId, teamId)))
      .returning();
    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to leave the team');
    }

    if (isOwner) {
      await this.delete(actorUserId, teamId, false, true);
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_LEFT, {
      actorUserId,
      teamId,
      userId: actorUserId,
    });

    return row;
  }

  // Permissions
  async userCanView(userId: string, teamId: string): Promise<boolean> {
    const row = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)),
    });

    return !!row;
  }

  async userCanUpdate(userId: string, teamId: string): Promise<boolean> {
    const row = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)),
    });

    if (!row) {
      return false;
    }

    return row.roles.includes(TeamUserRoleEnum.OWNER) || row.roles.includes(TeamUserRoleEnum.ADMIN);
  }

  async userCanDelete(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  async userCanInviteMember(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  async userCanUpdateMember(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  async userCanRemoveMember(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  async getPermissions(userId: string, teamId: string): Promise<ApiTeam['permissions']> {
    const canView = await this.userCanView(userId, teamId);
    const canUpdate = await this.userCanUpdate(userId, teamId);
    const canDelete = await this.userCanDelete(userId, teamId);
    const canInviteMember = await this.userCanInviteMember(userId, teamId);
    const canUpdateMember = await this.userCanUpdateMember(userId, teamId);
    const canRemoveMember = await this.userCanRemoveMember(userId, teamId);

    return {
      canView,
      canUpdate,
      canDelete,
      canInviteMember,
      canUpdateMember,
      canRemoveMember,
    };
  }

  // Helpers
  async findOneById(teamId: string): Promise<Team | null> {
    const row = await getDatabase().query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    return row ?? null;
  }

  async findManyByUserId(userId: string): Promise<Team[]> {
    return getDatabase().query.teams.findMany({
      where: and(eq(teams.userId, userId), isNull(teams.deletedAt)),
      orderBy: desc(teams.name),
    });
  }

  async insertOne(data: NewTeam): Promise<Team> {
    const rows = await getDatabase().insert(teams).values(data).returning();

    return rows[0];
  }

  async updateOneById(teamId: string, data: Partial<NewTeam>): Promise<Team> {
    const rows = await getDatabase()
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.id, teamId))
      .returning();

    return rows[0];
  }

  async updateOneByUserId(userId: string, data: Partial<NewTeam>): Promise<Team> {
    const rows = await getDatabase()
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.userId, userId))
      .returning();

    return rows[0];
  }

  async deleteOneById(teamId: string): Promise<Team> {
    const rows = await getDatabase().delete(teams).where(eq(teams.id, teamId)).returning();

    return rows[0];
  }

  async findOneInvitationById(teamUserInvitationId: string): Promise<TeamUserInvitation | null> {
    const row = await getDatabase().query.teamUserInvitations.findFirst({
      where: eq(teamUserInvitations.id, teamUserInvitationId),
    });

    return row ?? null;
  }

  async findOneInvitationByToken(
    teamUserInvitationToken: string
  ): Promise<TeamUserInvitation | null> {
    const row = await getDatabase().query.teamUserInvitations.findFirst({
      where: eq(teamUserInvitations.token, teamUserInvitationToken),
    });

    return row ?? null;
  }

  async getJoinedTeamAndTeamUser(
    userId: string
  ): Promise<{ team: Team; teamUser: TeamUser } | null> {
    const rows = await getDatabase()
      .select()
      .from(teamUsers)
      .leftJoin(teams, eq(teamUsers.teamId, teams.id))
      .where(and(eq(teamUsers.userId, userId), isNull(teams.deletedAt)))
      .orderBy(desc(teamUsers.updatedAt))
      .limit(1)
      .execute();
    if (rows.length === 0) {
      return null;
    }

    const row = rows[0] ?? null;
    if (!row || !row.teams || !row.team_users) {
      return null;
    }

    const team = {
      ...row.teams,
      permissions: await this.getPermissions(userId, row.teams.id),
    };
    const teamUser = row.team_users;

    return {
      team,
      teamUser,
    };
  }

  async getTeamMembers(userId: string, teamId: string): Promise<TeamUser[]> {
    const canView = await this.userCanView(userId, teamId);
    if (!canView) {
      return [];
    }

    const where = and(eq(teamUsers.teamId, teamId), isNull(teams.deletedAt));

    const rows = await getDatabase()
      .select()
      .from(teamUsers)
      .leftJoin(teams, eq(teams.id, teamUsers.teamId))
      .leftJoin(users, eq(users.id, teamUsers.userId))
      .where(where)
      .execute();

    return rows.map((row) => {
      // Really be mindful that we only want to expose the minimum required fields here!
      const user = row.users
        ? {
            id: row.users.id,
            displayName: row.users.displayName,
            birthDate: row.users.birthDate,
            email: row.users.email,
            createdAt: row.users.createdAt,
          }
        : undefined;

      return {
        ...row.team_users,
        user,
      };
    });
  }

  async getTeamInvitations(teamId: string): Promise<TeamUserInvitation[]> {
    const where = and(
      eq(teamUserInvitations.teamId, teamId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      isNull(teams.deletedAt)
    );

    const rows = await getDatabase()
      .select()
      .from(teamUserInvitations)
      .leftJoin(teams, eq(teams.id, teamUserInvitations.teamId))
      .where(where)
      .execute();

    return rows.map((row) => {
      return row.team_user_invitations;
    });
  }

  async getUserInvitations(userId: string, userEmail?: string): Promise<TeamUserInvitation[]> {
    const now = new Date();
    const where = and(
      userEmail
        ? or(eq(teamUserInvitations.userId, userId), eq(teamUserInvitations.email, userEmail))
        : eq(teamUserInvitations.userId, userId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      gt(teamUserInvitations.expiresAt, now),
      isNull(teams.deletedAt)
    );

    const invitedByUsers = alias(users, 'invitedByUsers');
    const rows = await getDatabase()
      .select()
      .from(teamUserInvitations)
      .leftJoin(teams, eq(teams.id, teamUserInvitations.teamId))
      .leftJoin(users, eq(users.id, teamUserInvitations.userId))
      .leftJoin(invitedByUsers, eq(invitedByUsers.id, teamUserInvitations.invitedByUserId))
      .where(where)
      .execute();

    const emailsSet = new Set<string>();
    for (const row of rows) {
      if (row.team_user_invitations.email) {
        emailsSet.add(row.team_user_invitations.email);
      }
    }

    const usersByEmail =
      emailsSet.size > 0 ? await this._usersManager.findManyByEmails([...emailsSet.values()]) : [];
    const usersByEmailMap = new Map<string, User>();
    for (const user of usersByEmail) {
      usersByEmailMap.set(user.email, user);
    }

    return rows
      .filter((row) => {
        if (!row.team_user_invitations.email) {
          return true;
        }

        if (!usersByEmailMap.has(row.team_user_invitations.email)) {
          return true;
        }

        const user = usersByEmailMap.get(row.team_user_invitations.email);
        if (!user) {
          return true;
        }

        return !!user.emailConfirmedAt;
      })
      .map((row) => {
        // Again, really be mindful that we only want to expose the minimum required fields here!
        const invitedByUser = row.invitedByUsers
          ? {
              id: row.invitedByUsers.id,
              displayName: row.invitedByUsers.displayName,
              birthDate: row.invitedByUsers.birthDate,
              email: row.invitedByUsers.email,
              createdAt: row.invitedByUsers.createdAt,
            }
          : undefined;

        // We don't want to expose the token
        row.team_user_invitations.token = '';

        return {
          ...row.team_user_invitations,
          team: row.teams,
          invitedByUser,
        };
      });
  }

  async acceptTeamInvitation(
    userId: string,
    teamUserInvitationId: string
  ): Promise<TeamUserInvitation | null> {
    const teamUserInvitation = await this.findOneInvitationById(teamUserInvitationId);
    if (!teamUserInvitation) {
      throw new Error('Invitation not found');
    }

    if (teamUserInvitation.userId && teamUserInvitation.userId !== userId) {
      throw new Error('You cannot accept this invitation');
    }

    if (teamUserInvitation.acceptedAt) {
      throw new Error('Invitation was already accepted');
    }

    if (teamUserInvitation.rejectedAt) {
      throw new Error('Invitation was already rejected');
    }

    const now = new Date();
    if (teamUserInvitation.expiresAt && teamUserInvitation.expiresAt < now) {
      throw new Error('Invitation has already expired');
    }

    const rows = await getDatabase()
      .update(teamUserInvitations)
      .set({ acceptedAt: now })
      .where(eq(teamUserInvitations.id, teamUserInvitationId))
      .returning();

    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to accept invitation');
    }

    await getDatabase().insert(teamUsers).values({
      teamId: row.teamId,
      userId,
      roles: row.roles,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITE_ACCEPTED, {
      actorUserId: userId,
      teamId: teamUserInvitation.teamId,
      userId,
      teamUserInvitationId,
    });

    return row;
  }

  async rejectTeamInvitation(
    userId: string,
    teamUserInvitationId: string
  ): Promise<TeamUserInvitation | null> {
    const teamUserInvitation = await this.findOneInvitationById(teamUserInvitationId);
    if (!teamUserInvitation) {
      throw new Error('Invitation not found');
    }

    if (teamUserInvitation.userId !== userId) {
      throw new Error('You cannot reject this invitation');
    }

    const now = new Date();

    const rows = await getDatabase()
      .update(teamUserInvitations)
      .set({ rejectedAt: now })
      .where(eq(teamUserInvitations.id, teamUserInvitationId))
      .returning();

    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to reject invitation');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITE_REJECTED, {
      actorUserId: userId,
      teamId: teamUserInvitation.teamId,
      userId,
      teamUserInvitationId,
    });

    return row;
  }

  async deleteTeamInvitation(
    userId: string,
    teamUserInvitationId: string
  ): Promise<TeamUserInvitation | null> {
    const teamUserInvitation = await this.findOneInvitationById(teamUserInvitationId);
    if (!teamUserInvitation) {
      return null;
    }

    if (teamUserInvitation.userId !== userId && teamUserInvitation.invitedByUserId !== userId) {
      throw new Error('You cannot delete this invitation');
    }

    const canInvite = await this.userCanInviteMember(userId, teamUserInvitation.teamId);
    if (!canInvite) {
      throw new Error('You cannot remove invites for this team');
    }

    const rows = await getDatabase()
      .delete(teamUserInvitations)
      .where(eq(teamUserInvitations.id, teamUserInvitation.id))
      .returning();
    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to delete invitation');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITE_DELETED, {
      actorUserId: userId,
      teamId: teamUserInvitation.teamId,
      userId,
      teamUserInvitationId,
    });

    return row;
  }

  async inviteTeamMember(
    userId: string,
    teamId: string,
    email: string
  ): Promise<TeamUserInvitation> {
    const canInvite = await this.userCanInviteMember(userId, teamId);
    if (!canInvite) {
      throw new Error('You cannot send invites for this team');
    }

    const invitedUser = await getDatabase().query.users.findFirst({
      where: eq(users.email, email),
    });
    const invitedUserId = invitedUser?.id ?? null;

    const existingInvitation = await getDatabase().query.teamUserInvitations.findFirst({
      where: and(
        eq(teamUserInvitations.teamId, teamId),
        invitedUserId
          ? eq(teamUserInvitations.userId, invitedUserId)
          : eq(teamUserInvitations.email, email),
        isNull(teamUserInvitations.acceptedAt),
        isNull(teamUserInvitations.rejectedAt)
      ),
    });
    if (existingInvitation) {
      throw new Error('User is already invited');
    }

    if (invitedUserId) {
      const existingTeamMember = await getDatabase().query.teamUsers.findFirst({
        where: and(eq(teamUsers.teamId, teamId), eq(teamUsers.userId, invitedUserId)),
      });
      if (existingTeamMember) {
        throw new Error('User is already a member');
      }
    }

    const user = await getDatabase().query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) {
      throw new Error('Invited by user not found');
    }

    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const expiresAt = addDays(new Date(), 7);
    const token = uuidv4();

    const teamUserInvitationRows = await getDatabase()
      .insert(teamUserInvitations)
      .values({
        roles: [TeamUserRoleEnum.MEMBER],
        email,
        token,
        expiresAt,
        teamId,
        userId: invitedUserId,
        invitedByUserId: userId,
      })
      .returning();

    const row = teamUserInvitationRows[0];
    if (!row) {
      throw new Error('Failed to create a team user invitation. Please try again.');
    }

    await mailer.sendTeamsUserInvitationEmail({
      userEmail: email,
      teamName: team.name,
      invitedByUserDisplayName: user.displayName ?? 'User',
      registerUrl: `${getEnv().WEB_URL}/register?teamUserInvitationToken=${token}`,
    });

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_INVITED, {
      actorUserId: userId,
      teamId,
      teamUserInvitationId: row.id,
    });

    return row;
  }

  async deleteTeamMember(adminUserId: string, userId: string, teamId: string) {
    if (adminUserId === userId) {
      throw new Error('You cannot remove yourself from the team');
    }

    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const canRemoveMember = await this.userCanRemoveMember(adminUserId, teamId);
    if (!canRemoveMember) {
      throw new Error('You cannot remove this members from the team');
    }

    const teamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)),
    });
    if (!teamUser) {
      throw new Error('Member not found');
    }

    if (teamUser.roles.includes(TeamUserRoleEnum.OWNER)) {
      throw new Error('You cannot remove an owner from the team');
    }

    const rows = await getDatabase()
      .delete(teamUsers)
      .where(and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)))
      .returning();

    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to remove member from the team');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_DELETED, {
      actorUserId: adminUserId,
      teamId,
      userId,
    });

    return row;
  }

  async updateTeamMember(
    actorUserId: string,
    userId: string,
    teamId: string,
    data: UpdateTeamUser
  ) {
    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const actorTeamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, actorUserId), eq(teamUsers.teamId, teamId)),
    });
    if (!actorTeamUser) {
      throw new Error('Admin team user not found');
    }

    const teamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)),
    });
    if (!teamUser) {
      throw new Error('Member not found');
    }

    const canUpdate = await this.userCanUpdate(actorUserId, teamId);
    if (!canUpdate) {
      throw new Error('You cannot update this member');
    }

    if (
      actorTeamUser.id === userId &&
      !data.roles.includes(TeamUserRoleEnum.OWNER) &&
      actorTeamUser.roles.includes(TeamUserRoleEnum.OWNER)
    ) {
      throw new Error('You cannot remove the owner role from yourself');
    }

    if (
      data.roles &&
      data.roles.length > 0 &&
      data.roles.includes(TeamUserRoleEnum.OWNER) &&
      !actorTeamUser.roles.includes(TeamUserRoleEnum.OWNER)
    ) {
      throw new Error('You cannot set a member as owner');
    }

    if (
      data.roles &&
      data.roles.length > 0 &&
      data.roles.includes(TeamUserRoleEnum.ADMIN) &&
      !actorTeamUser.roles.includes(TeamUserRoleEnum.OWNER) &&
      !actorTeamUser.roles.includes(TeamUserRoleEnum.ADMIN)
    ) {
      throw new Error('You cannot set a member as admin');
    }

    if (data.roles && data.roles.includes(TeamUserRoleEnum.OWNER)) {
      let ownerTeamUser: TeamUser | null = null;
      const allTeamUsers = await getDatabase().query.teamUsers.findMany({
        where: and(eq(teamUsers.teamId, teamId)),
      });
      for (const teamUser of allTeamUsers) {
        if (teamUser.roles.includes(TeamUserRoleEnum.OWNER)) {
          ownerTeamUser = teamUser;
          break;
        }
      }

      if (ownerTeamUser && ownerTeamUser.id !== teamUser.id) {
        throw new Error('There is already an owner in this team');
      }
    }

    const rows = await getDatabase()
      .update(teamUsers)
      .set(data)
      .where(eq(teamUsers.id, teamUser.id))
      .returning();

    const row = rows[0] ?? null;
    if (!row) {
      throw new Error('Failed to update member');
    }

    globalEventsNotifier.publish(GlobalEventsEnum.TEAMS_TEAM_MEMBER_UPDATED, {
      actorUserId: actorUserId,
      teamId,
      userId,
    });

    return row;
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(teams.id).mapWith(Number),
      })
      .from(teams)
      .where(and(eq(teams.userId, userId), isNull(teams.deletedAt)))
      .execute();

    return result[0].count ?? 0;
  }

  async getAvailableInvitationByToken(token: string): Promise<TeamUserInvitation> {
    const invitation = await this.findOneInvitationByToken(token);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const now = new Date();
    if (invitation.expiresAt && invitation.expiresAt < now) {
      throw new Error('Invitation has already expired');
    }

    if (invitation.acceptedAt) {
      throw new Error('Invitation was already accepted');
    }

    if (invitation.rejectedAt) {
      throw new Error('Invitation was already rejected');
    }

    return invitation;
  }
}

export const teamsManager = new TeamsManager(usersManager, userUsageManager);
