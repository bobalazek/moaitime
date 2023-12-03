import { dropDatabaseSchemas, runDatabaseMigrations } from '@myzenbuddy/database-core';
import { insertDatabaseFixtureData } from '@myzenbuddy/database-fixtures';
import { insertDatabaseSeedData } from '@myzenbuddy/database-seeds';

export const reloadDatabase = async () => {
  await dropDatabaseSchemas();
  await runDatabaseMigrations();
  await insertDatabaseSeedData();
  await insertDatabaseFixtureData();
};
