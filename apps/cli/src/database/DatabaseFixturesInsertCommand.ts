import type { Command } from 'commander';

import { insertDatabaseFixtureData } from '@moaitime/database-fixtures';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseFixturesInsertCommand = (program: Command) => {
  const command = program.command('database:fixtures:insert').action(async () => {
    try {
      await insertDatabaseFixtureData();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseFixturesInsertCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
