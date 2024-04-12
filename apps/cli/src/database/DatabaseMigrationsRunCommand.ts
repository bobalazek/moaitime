import type { Command } from 'commander';

import { runDatabaseMigrations } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseMigrationsRunCommand = (program: Command) => {
  const command = program.command('database:migrations:run').action(async () => {
    try {
      await runDatabaseMigrations();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseMigrationsRunCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
