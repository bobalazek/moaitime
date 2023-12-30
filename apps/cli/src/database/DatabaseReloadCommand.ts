import type { Command } from 'commander';

import { reloadDatabase } from '@moaitime/database-testing';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseReloadCommand = (program: Command) => {
  const command = program.command('database:reload').action(async () => {
    try {
      await reloadDatabase();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseReloadCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
