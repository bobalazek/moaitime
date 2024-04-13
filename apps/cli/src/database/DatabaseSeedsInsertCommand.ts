import type { Command } from 'commander';

import { insertDatabaseSeedData } from '@moaitime/database-seeds';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseSeedsInsertCommand = (program: Command) => {
  const command = program.command('database:seeds:insert').action(async () => {
    try {
      await insertDatabaseSeedData();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseSeedsInsertCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
