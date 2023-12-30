import { subSeconds } from 'date-fns';
import { desc, gt } from 'drizzle-orm';

import { getDatabase, User, users } from '@moaitime/database-core';
import { logger, Logger } from '@moaitime/logging';
import { AUTH_DELETION_HARD_DELETE_SECONDS } from '@moaitime/shared-backend';

import { usersManager, UsersManager } from './UsersManager';

export class UserDeletionManager {
  constructor(
    private _logger: Logger,
    private _usersManager: UsersManager
  ) {}

  async processOverdueForDeletion(now = new Date()) {
    this._logger.info('Processing overdue users for deletion ...');

    const expiryDate = subSeconds(now, AUTH_DELETION_HARD_DELETE_SECONDS);

    this._logger.debug(`Expiry date after: ${expiryDate.toISOString()}`);

    const result = await getDatabase().query.users.findMany({
      where: gt(users.deletionRequestedAt, expiryDate),
      orderBy: desc(users.deletedAt),
    });

    this._logger.debug(
      `Found ${result.length} users overdue for deletion. Starting to process ...`
    );

    for (const user of result) {
      await this._processUser(user);
    }

    this._logger.info('All overdue users were successfully processed.');
  }

  private async _processUser(user: User) {
    this._logger.debug(`Processing user ${user.id} ...`);

    await this._usersManager.deleteOneById(user.id);

    this._logger.debug(`User ${user.id} was successfully deleted.`);
  }
}

export const userDeletionManager = new UserDeletionManager(logger, usersManager);
