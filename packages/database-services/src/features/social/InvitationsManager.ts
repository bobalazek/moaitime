import { addDays } from 'date-fns';
import { and, count, DBQueryConfig, eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

import { getDatabase, Invitation, invitations, NewInvitation } from '@moaitime/database-core';
import { mailer } from '@moaitime/emails-mailer';
import { WEB_URL } from '@moaitime/shared-common';

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

  // API Helpers
  async list(userId: string) {
    return this.findMany({
      where: eq(invitations.userId, userId),
    });
  }

  async invite(userId: string, email: string): Promise<Invitation> {
    const invitedByUser = await usersManager.findOneById(userId);
    if (!invitedByUser) {
      throw new Error('User not found');
    }

    const existingInvitation = await getDatabase().query.invitations.findFirst({
      where: and(eq(invitations.userId, userId), eq(invitations.email, email)),
    });
    if (existingInvitation) {
      throw new Error('User is already invited');
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
      invitedByUserDisplayName: invitedByUser.displayName ?? 'User',
      registerUrl: `${WEB_URL}/register?invitationToken=${token}`,
    });

    return invitation;
  }
}

export const invitationsManager = new InvitationsManager();
