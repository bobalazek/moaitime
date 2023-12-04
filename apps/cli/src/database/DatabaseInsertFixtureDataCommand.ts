import type { Command } from 'commander';

import { insertDatabaseFixtureData } from '@myzenbuddy/database-fixtures';
import { logger } from '@myzenbuddy/shared-logging';

export const addDatabaseInsertFixtureDataCommand = (program: Command) => {
  const command = program.command('database:insert-fixture-data').action(async () => {
    logger.info('Inserting database fixture data ...');

    await insertDatabaseFixtureData();
  });
  program.addCommand(command);
};
