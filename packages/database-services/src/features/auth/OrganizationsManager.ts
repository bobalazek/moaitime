import { DBQueryConfig, eq } from 'drizzle-orm';

import { getDatabase, NewOrganization, Organization, organizations } from '@moaitime/database-core';

export class OrganizationsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<Organization[]> {
    return getDatabase().query.organizations.findMany(options);
  }

  async findOneById(id: string): Promise<Organization | null> {
    const row = await getDatabase().query.organizations.findFirst({
      where: eq(organizations.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewOrganization): Promise<Organization> {
    const rows = await getDatabase().insert(organizations).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewOrganization>): Promise<Organization> {
    const rows = await getDatabase()
      .update(organizations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(organizations.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<Organization> {
    const rows = await getDatabase()
      .delete(organizations)
      .where(eq(organizations.id, id))
      .returning();

    return rows[0];
  }
}

export const organizationsManager = new OrganizationsManager();
