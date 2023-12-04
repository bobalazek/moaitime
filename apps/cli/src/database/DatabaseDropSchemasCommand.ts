import type { Command } from 'commander';

import { dropDatabaseSchemas } from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

export const addDatabaseDropSchemasCommand = (program: Command) => {
  const command = program.command('database:drop-schemas').action(async () => {
    logger.info('Dropping database schemas ...');

    await dropDatabaseSchemas();
  });
  program.addCommand(command);
};
