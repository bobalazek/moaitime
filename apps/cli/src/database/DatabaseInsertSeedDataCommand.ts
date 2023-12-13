import type { Command } from 'commander';

import { insertDatabaseSeedData } from '@moaitime/database-seeds';

export const addDatabaseInsertSeedDataCommand = (program: Command) => {
  const command = program.command('database:insert-seed-data').action(async () => {
    await insertDatabaseSeedData();
  });
  program.addCommand(command);
};
