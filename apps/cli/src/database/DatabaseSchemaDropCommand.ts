import type { Command } from 'commander';

import { dropDatabaseSchema } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { shutdownManager } from '@moaitime/processes';

export const addDatabaseSchemaDropCommand = (program: Command) => {
  const command = program.command('database:schema:drop').action(async () => {
    try {
      logger.info('Dropping database schema ...');

      await dropDatabaseSchema();

      await shutdownManager.shutdown(0);
    } catch (error) {
      logger.error(error, '[addDatabaseSchemaDropCommand] Error');

      await shutdownManager.shutdown(1);
    }
  });
  program.addCommand(command);
};
