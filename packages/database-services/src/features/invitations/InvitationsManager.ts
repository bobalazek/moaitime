import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, Invitation, invitations, NewInvitation } from '@moaitime/database-core';

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
}

export const invitationsManager = new InvitationsManager();
