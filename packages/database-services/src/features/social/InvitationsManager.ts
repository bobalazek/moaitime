import { addDays } from 'date-fns';
import { and, count, DBQueryConfig, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { getDatabase, Invitation, invitations, NewInvitation } from '@moaitime/database-core';
import { mailer } from '@moaitime/emails-mailer';
import { getEnv } from '@moaitime/shared-backend';

import { usersManager } from '../auth/UsersManager';

export class InvitationsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Invitation[]> {
    return getDatabase().query.invitations.findMany(options);
  }

  async findOneById(id: string): Promise<Invitation | null> {
    const row = await getDatabase().query.invitations.findFirst({
      where: eq(invitations.id, id),
    });

    return row ?? null;
  }

  async findOneByToken(token: string): Promise<Invitation | null> {
    const row = await getDatabase().query.invitations.findFirst({
      where: eq(invitations.token, token),
    });

    return row ?? null;
  }

  async findOneByIdAndUserId(id: string, userId: string): Promise<Invitation | null> {
    const row = await getDatabase().query.invitations.findFirst({
      where: and(eq(invitations.id, id), eq(invitations.userId, userId)),
    });

    return row ?? null;
  }

  async insertOne(data: NewInvitation): Promise<Invitation> {
    const rows = await getDatabase().insert(invitations).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewInvitation>): Promise<Invitation> {
    const rows = await getDatabase()
      .update(invitations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Invitation> {
    const rows = await getDatabase().delete(invitations).where(eq(invitations.id, id)).returning();

    return rows[0];
  }

  // Helpers
  async countByUserId(userId: string): Promise<number> {
    const result = await getDatabase()
      .select({
        count: count(invitations.id).mapWith(Number),
      })
      .from(invitations)
      .where(eq(invitations.userId, userId))
      .execute();

    return result[0].count ?? 0;
  }

  async getAvailableInvitationByToken(token: string): Promise<Invitation> {
    const invitation = await this.findOneByToken(token);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    const now = new Date();
    if (invitation.expiresAt && invitation.expiresAt < now) {
      throw new Error('Invitation has already expired');
    }

    if (invitation.claimedAt) {
      throw new Error('Invitation was already claimed');
    }

    return invitation;
  }

  async claimInvitation(userId: string, invitation: Invitation): Promise<Invitation> {
    const now = new Date();

    const updatedInvitation = await this.updateOneById(invitation.id, {
      claimedAt: now,
      claimedUserId: userId,
    });

    return updatedInvitation;
  }

  // API Helpers
  async list(actorUserId: string) {
    const data = await this.findMany({
      where: eq(invitations.userId, actorUserId),
    });

    return data.map((row) => ({
      ...row,
      permissions: {
        canDelete: !row.claimedAt,
      },
    }));
  }

  async create(userId: string, email: string): Promise<Invitation> {
    const user = await usersManager.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const existingUser = await usersManager.findOneByEmail(email);
    if (existingUser) {
      throw new Error('A user with this email is already registered');
    }

    const existingInvitation = await getDatabase().query.invitations.findFirst({
      where: and(eq(invitations.userId, userId), eq(invitations.email, email)),
    });
    if (existingInvitation) {
      throw new Error('A user with this email was already invited');
    }

    const count = await this.countByUserId(userId);
    const countLimit = await usersManager.getUserLimit(user, 'userInvitationsMaxPerUserCount');
    if (count >= countLimit) {
      throw new Error('You have reached the maximum number of invitations');
    }

    const expiresAt = addDays(new Date(), 7);
    const token = uuidv4();

    const invitationRows = await getDatabase()
      .insert(invitations)
      .values({
        email,
        token,
        expiresAt,
        userId,
      })
      .returning();

    const invitation = invitationRows[0];
    if (!invitation) {
      throw new Error('Failed to create an invitation. Please try again.');
    }

    await mailer.sendSocialUserInvitationEmail({
      userEmail: email,
      invitedByUserDisplayName: user.displayName ?? 'User',
      registerUrl: `${getEnv().WEB_BASE_URL}/register?invitationToken=${token}`,
    });

    return invitation;
  }

  async delete(userId: string, invitationId: string): Promise<Invitation> {
    const invitation = await this.findOneByIdAndUserId(invitationId, userId);
    if (!invitation) {
      throw new Error('Invitation not found');
    }

    if (invitation.claimedAt) {
      throw new Error('You cannot remove an already claimed invitation');
    }

    return this.deleteOneById(invitationId);
  }
}

export const invitationsManager = new InvitationsManager();
