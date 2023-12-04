import type { Command } from 'commander';

import { runDatabaseMigrations } from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

export const addDatabaseRunMigrationsCommand = (program: Command) => {
  const command = program.command('database:run-migrations').action(async () => {
    logger.info('Running database migrations ...');

    await runDatabaseMigrations();
  });
  program.addCommand(command);
};
