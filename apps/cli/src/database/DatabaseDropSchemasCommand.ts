import type { Command } from 'commander';

import { dropDatabaseSchema } from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

export const addDatabaseDropSchemasCommand = (program: Command) => {
  const command = program.command('database:drop-schema').action(async () => {
    logger.info('Dropping database schema ...');

    await dropDatabaseSchema();
  });
  program.addCommand(command);
};
