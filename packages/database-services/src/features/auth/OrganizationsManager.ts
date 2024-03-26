import { eq } from 'drizzle-orm';

import { getDatabase, NewOrganization, Organization, organizations } from '@moaitime/database-core';

export class OrganizationsManager {
  // Helpers
  async findOneById(organizationId: string): Promise<Organization | null> {
    const row = await getDatabase().query.organizations.findFirst({
      where: eq(organizations.id, organizationId),
    });

    return row ?? null;
  }

  async insertOne(data: NewOrganization): Promise<Organization> {
    const rows = await getDatabase().insert(organizations).values(data).returning();

    return rows[0];
  }

  async updateOneById(
    organizationId: string,
    data: Partial<NewOrganization>
  ): Promise<Organization> {
    const rows = await getDatabase()
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();

    return rows[0];
  }

  async deleteOneById(organizationId: string): Promise<Organization> {
    const rows = await getDatabase()
      .delete(organizations)
      .where(eq(organizations.id, organizationId))
      .returning();

    return rows[0];
  }
}

export const organizationsManager = new OrganizationsManager();
