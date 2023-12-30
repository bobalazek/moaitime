import type { Command } from 'commander';

import { insertDatabaseSeedData } from '@moaitime/database-seeds';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseInsertSeedDataCommand = (program: Command) => {
  const command = program.command('database:insert-seed-data').action(async () => {
    try {
      await insertDatabaseSeedData();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseInsertSeedDataCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
