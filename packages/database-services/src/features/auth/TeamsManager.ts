import { addDays } from 'date-fns';
import { and, count, DBQueryConfig, desc, eq, gt, isNull, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';

import {
  getDatabase,
  NewTeam,
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
import {
  TeamLimits,
  TeamUsage,
  TeamUserRoleEnum,
  UpdateTeam,
  UpdateTeamUser,
  WEB_URL,
} from '@moaitime/shared-common';

import { calendarsManager } from '../calendars/CalendarsManager';
import { listsManager } from '../tasks/ListsManager';
import { usersManager } from './UsersManager';

export class TeamsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Team[]> {
    return getDatabase().query.teams.findMany(options);
  }

  async findOneById(id: string): Promise<Team | null> {
    const row = await getDatabase().query.teams.findFirst({
      where: eq(teams.id, id),
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

  async updateOneById(id: string, data: Partial<NewTeam>): Promise<Team> {
    const rows = await getDatabase()
      .update(teams)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teams.id, id))
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

  async deleteOneById(id: string): Promise<Team> {
    const rows = await getDatabase().delete(teams).where(eq(teams.id, id)).returning();

    return rows[0];
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

  async userCanRemoveMember(userId: string, teamId: string): Promise<boolean> {
    return this.userCanUpdate(userId, teamId);
  }

  // API Helpers
  async list(userId: string) {
    return this.findManyByUserId(userId);
  }

  async update(userId: string, teamId: string, data: UpdateTeam) {
    const canView = await this.userCanUpdate(userId, teamId);
    if (!canView) {
      throw new Error('You cannot update this team');
    }

    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    return this.updateOneById(teamId, data);
  }

  async delete(userId: string, teamId: string, isHardDelete?: boolean) {
    const canDelete = await this.userCanDelete(userId, teamId);
    if (!canDelete) {
      throw new Error('Team not found');
    }

    return isHardDelete
      ? this.deleteOneById(teamId)
      : this.updateOneById(teamId, {
          deletedAt: new Date(),
        });
  }

  async undelete(userId: string, teamId: string) {
    const canDelete = await this.userCanUpdate(userId, teamId);
    if (!canDelete) {
      throw new Error('You cannot undelete this team');
    }

    return this.updateOneById(teamId, {
      deletedAt: null,
    });
  }

  async createAndJoin(user: User, teamName: string): Promise<{ team: Team; teamUser: TeamUser }> {
    const maxCount = await usersManager.getUserLimit(user, 'teamsMaxPerUserCount');
    const currentCount = await this.countByUserId(user.id);
    if (currentCount >= maxCount) {
      throw new Error(`You have reached the maximum number of teams per user (${maxCount}).`);
    }

    const team = await this.insertOne({
      name: teamName,
      userId: user.id,
    });

    const teamUserRows = await getDatabase()
      .insert(teamUsers)
      .values({
        teamId: team.id,
        userId: user.id,
        roles: [TeamUserRoleEnum.OWNER],
      })
      .returning();

    return {
      team,
      teamUser: teamUserRows[0],
    };
  }

  async leave(userId: string, teamId: string) {
    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const teamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)),
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
      .where(and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)))
      .returning();

    if (isOwner) {
      await this.delete(userId, teamId);
    }

    return rows[0] ?? null;
  }

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getTeamLimits(team: Team): Promise<TeamLimits> {
    // TODO: once we have plans, we need to adjust the limits depending on that

    return {
      tasksMaxPerListCount: 10,
      listsMaxPerTeamCount: 3,
      usersMaxPerTeamCount: 5,
      calendarsMaxPerTeamCount: 3,
      calendarsMaxEventsPerCalendarCount: 100,
    };
  }

  async getTeamLimit(team: Team, key: keyof TeamLimits): Promise<number> {
    const limits = await this.getTeamLimits(team);

    return limits[key];
  }

  async getTeamUsage(team: Team): Promise<TeamUsage> {
    // TODO: cache!

    const listsCount = await listsManager.countByTeamId(team.id);
    const usersCount = await usersManager.countByTeamId(team.id);
    const calendarsCount = await calendarsManager.countByTeamId(team.id);

    return {
      listsCount,
      usersCount,
      calendarsCount,
    };
  }

  async getInvitationById(teamUserInvitationId: string): Promise<TeamUserInvitation | null> {
    const row = await getDatabase().query.teamUserInvitations.findFirst({
      where: eq(teamUserInvitations.id, teamUserInvitationId),
    });

    return row ?? null;
  }

  async getJoinedTeamByUserId(userId: string): Promise<{ team: Team; teamUser: TeamUser } | null> {
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

    const row = rows[0];
    if (!row.teams || !row.team_users) {
      return null;
    }

    return {
      team: row.teams,
      teamUser: row.team_users,
    };
  }

  async getMembersByTeamId(userId: string, teamId: string): Promise<TeamUser[]> {
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

  async getInvitationsByTeamId(teamId: string): Promise<TeamUserInvitation[]> {
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

  async getInvitationsByUser(userId: string, userEmail?: string): Promise<TeamUserInvitation[]> {
    const now = new Date();
    const where = and(
      userEmail
        ? or(
            eq(teamUserInvitations.userId, userId),
            and(eq(teamUserInvitations.email, userEmail), isNull(users.emailConfirmedAt))
          )
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

    return rows.map((row) => {
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

      return {
        ...row.team_user_invitations,
        team: row.teams,
        invitedByUser,
      };
    });
  }

  async acceptInvitationByIdAndUserId(
    teamUserInvitationId: string,
    userId: string
  ): Promise<TeamUserInvitation | null> {
    const now = new Date();
    const where = and(
      eq(teamUserInvitations.id, teamUserInvitationId),
      eq(teamUserInvitations.userId, userId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      gt(teamUserInvitations.expiresAt, now)
    );

    const rows = await getDatabase()
      .update(teamUserInvitations)
      .set({ acceptedAt: now })
      .where(where)
      .returning();

    const row = rows[0] ?? null;

    if (row) {
      await getDatabase().insert(teamUsers).values({
        teamId: row.teamId,
        userId,
        roles: row.roles,
      });
    }

    return row;
  }

  async rejectInvitationByIdAndUserId(
    teamUserInvitationId: string,
    userId: string
  ): Promise<TeamUserInvitation | null> {
    const now = new Date();
    const where = and(
      eq(teamUserInvitations.id, teamUserInvitationId),
      eq(teamUserInvitations.userId, userId),
      isNull(teamUserInvitations.acceptedAt),
      isNull(teamUserInvitations.rejectedAt),
      gt(teamUserInvitations.expiresAt, now)
    );

    const rows = await getDatabase()
      .update(teamUserInvitations)
      .set({ rejectedAt: now })
      .where(where)
      .returning();

    return rows[0] ?? null;
  }

  async deleteInvitationByIdAndUserId(
    teamUserInvitationId: string,
    userId: string
  ): Promise<TeamUserInvitation | null> {
    const teamUserInvitation = await this.getInvitationById(teamUserInvitationId);
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

    return rows[0] ?? null;
  }

  async sendInvitation(
    teamId: string,
    invitedByUserId: string,
    email: string
  ): Promise<TeamUserInvitation> {
    const canInvite = await this.userCanInviteMember(invitedByUserId, teamId);
    if (!canInvite) {
      throw new Error('You cannot send invites for this team');
    }

    const existingUser = await getDatabase().query.users.findFirst({
      where: eq(users.email, email),
    });
    const userId = existingUser?.id ?? null;

    const existingInvitation = await getDatabase().query.teamUserInvitations.findFirst({
      where: and(
        eq(teamUserInvitations.teamId, teamId),
        userId ? eq(teamUserInvitations.userId, userId) : eq(teamUserInvitations.email, email),
        isNull(teamUserInvitations.acceptedAt),
        isNull(teamUserInvitations.rejectedAt)
      ),
    });
    if (existingInvitation) {
      throw new Error('User is already invited');
    }

    if (userId) {
      const existingTeamMember = await getDatabase().query.teamUsers.findFirst({
        where: and(eq(teamUsers.teamId, teamId), eq(teamUsers.userId, userId)),
      });
      if (existingTeamMember) {
        throw new Error('User is already a member');
      }
    }

    const invitedByUser = await getDatabase().query.users.findFirst({
      where: eq(users.id, invitedByUserId),
    });

    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const expiresAt = addDays(new Date(), 7);

    const teamUserInvitationRows = await getDatabase()
      .insert(teamUserInvitations)
      .values({
        roles: [TeamUserRoleEnum.MEMBER],
        email,
        expiresAt,
        teamId,
        userId,
        invitedByUserId,
      })
      .returning();

    const teamUserInvitation = teamUserInvitationRows[0];

    await mailer.sendAuthTeamInviteMemberEmail({
      userEmail: email,
      teamName: team.name,
      invitedByUserDisplayName: invitedByUser?.displayName ?? 'Unknown',
      registerUrl: `${WEB_URL}/register?teamUserInvitationId=${teamUserInvitation.id}`,
    });

    return teamUserInvitation;
  }

  async removeMemberFromTeam(adminUserId: string, userId: string, teamId: string) {
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

    const rows = await getDatabase()
      .delete(teamUsers)
      .where(and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)))
      .returning();

    return rows[0] ?? null;
  }

  async updateMember(adminUserId: string, userId: string, teamId: string, data: UpdateTeamUser) {
    const team = await this.findOneById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const adminTeamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, adminUserId), eq(teamUsers.teamId, teamId)),
    });
    if (!adminTeamUser) {
      throw new Error('Admin team user not found');
    }

    const teamUser = await getDatabase().query.teamUsers.findFirst({
      where: and(eq(teamUsers.userId, userId), eq(teamUsers.teamId, teamId)),
    });
    if (!teamUser) {
      throw new Error('Member not found');
    }

    const canUpdate = await this.userCanUpdate(adminUserId, teamId);
    if (!canUpdate) {
      throw new Error('You cannot update this member');
    }

    if (
      data.roles &&
      data.roles.length > 0 &&
      data.roles.includes(TeamUserRoleEnum.OWNER) &&
      !adminTeamUser.roles.includes(TeamUserRoleEnum.OWNER)
    ) {
      throw new Error('You cannot set a member as owner');
    }

    if (
      data.roles &&
      data.roles.length > 0 &&
      data.roles.includes(TeamUserRoleEnum.ADMIN) &&
      !adminTeamUser.roles.includes(TeamUserRoleEnum.OWNER) &&
      !adminTeamUser.roles.includes(TeamUserRoleEnum.ADMIN)
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

    return rows[0] ?? null;
  }
}

export const teamsManager = new TeamsManager();
