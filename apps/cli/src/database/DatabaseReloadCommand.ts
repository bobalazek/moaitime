import type { Command } from 'commander';

import { reloadDatabase } from '@moaitime/database-testing';

export const addDatabaseReloadCommand = (program: Command) => {
  const command = program.command('database:reload').action(async () => {
    await reloadDatabase();
  });
  program.addCommand(command);
};
