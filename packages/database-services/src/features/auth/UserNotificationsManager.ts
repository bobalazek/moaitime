import { DBQueryConfig, eq } from 'drizzle-orm';

import {
  getDatabase,
  NewUserNotification,
  UserNotification,
  userNotifications,
} from '@moaitime/database-core';

export class UserNotificationsManager {
  async findMany(options?: DBQueryConfig<'many', true>): Promise<UserNotification[]> {
    return getDatabase().query.userNotifications.findMany(options);
  }

  async findOneById(id: string): Promise<UserNotification | null> {
    const row = await getDatabase().query.userNotifications.findFirst({
      where: eq(userNotifications.id, id),
    });

    return row ?? null;
  }

  async insertOne(data: NewUserNotification): Promise<UserNotification> {
    const rows = await getDatabase().insert(userNotifications).values(data).returning();

    return rows[0];
  }

  async updateOneById(id: string, data: Partial<NewUserNotification>): Promise<UserNotification> {
    const rows = await getDatabase()
      .update(userNotifications)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(userNotifications.id, id))
      .returning();

    return rows[0];
  }

  async deleteOneById(id: string): Promise<UserNotification> {
    const rows = await getDatabase()
      .delete(userNotifications)
      .where(eq(userNotifications.id, id))
      .returning();

    return rows[0];
  }
}

export const userNotificationsManager = new UserNotificationsManager();
