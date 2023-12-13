import type { Command } from 'commander';

import { runDatabaseMigrations } from '@moaitime/database-core';

export const addDatabaseRunMigrationsCommand = (program: Command) => {
  const command = program.command('database:run-migrations').action(async () => {
    await runDatabaseMigrations();
  });
  program.addCommand(command);
};
