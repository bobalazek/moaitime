import { dropDatabaseSchemas, runDatabaseMigrations } from '@myzenbuddy/database-core';
import { insertDatabaseFixtureData } from '@myzenbuddy/database-fixtures';
import { insertDatabaseSeedData } from '@myzenbuddy/database-seeds';
import { logger } from '@myzenbuddy/shared-logging';

export const reloadDatabase = async () => {
  try {
    logger.info('Reloading database ...');

    await dropDatabaseSchemas();
    await runDatabaseMigrations();
    await insertDatabaseSeedData();
    await insertDatabaseFixtureData();
  } catch (error) {
    logger.error(error, 'Error reloading database');

    throw error;
  }
};
