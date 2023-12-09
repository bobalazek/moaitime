import type { Command } from 'commander';

import { insertDatabaseFixtureData } from '@myzenbuddy/database-fixtures';

export const addDatabaseInsertFixtureDataCommand = (program: Command) => {
  const command = program.command('database:insert-fixture-data').action(async () => {
    await insertDatabaseFixtureData();
  });
  program.addCommand(command);
};
