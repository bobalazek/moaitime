import type { Command } from 'commander';

import { reloadDatabase } from '@myzenbuddy/database-testing';
import { logger } from '@myzenbuddy/shared-logging';

export const addDatabaseReloadCommand = (program: Command) => {
  const command = program.command('database:reload').action(async () => {
    logger.info('Reloading database ...');

    await reloadDatabase();
  });
  program.addCommand(command);
};
