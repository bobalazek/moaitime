import type { Command } from 'commander';

import { insertDatabaseSeedData } from '@myzenbuddy/database-seeds';
import { logger } from '@myzenbuddy/shared-logging';

export const addDatabaseInsertSeedDataCommand = (program: Command) => {
  const command = program.command('database:insert-seed-data').action(async () => {
    logger.info('Inserting database seed data ...');

    await insertDatabaseSeedData();
  });
  program.addCommand(command);
};
