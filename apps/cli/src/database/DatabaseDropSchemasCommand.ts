import type { Command } from 'commander';

import { dropDatabaseSchema } from '@moaitime/database-core';
import { logger } from '@moaitime/shared-logging';

export const addDatabaseDropSchemasCommand = (program: Command) => {
  const command = program.command('database:drop-schema').action(async () => {
    logger.info('Dropping database schema ...');

    await dropDatabaseSchema();
  });
  program.addCommand(command);
};
