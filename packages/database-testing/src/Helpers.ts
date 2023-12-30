import { dropDatabaseSchema, runDatabaseMigrations } from '@moaitime/database-core';
import { insertDatabaseFixtureData } from '@moaitime/database-fixtures';
import { insertDatabaseSeedData } from '@moaitime/database-seeds';
import { logger } from '@moaitime/logging';

export const reloadDatabase = async () => {
  try {
    logger.info('Reloading database ...');

    await dropDatabaseSchema();
    await runDatabaseMigrations();
    await insertDatabaseSeedData();
    await insertDatabaseFixtureData();
  } catch (error) {
    logger.error(error, 'Error reloading database');

    throw error;
  }
};
