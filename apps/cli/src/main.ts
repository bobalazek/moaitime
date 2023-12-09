import { Command } from 'commander';

import { destroyDatabaseClient, destroyDatabaseMigrationClient } from '@myzenbuddy/database-core';
import { logger } from '@myzenbuddy/shared-logging';

import { addDatabaseDropSchemasCommand } from './database/DatabaseDropSchemasCommand';
import { addDatabaseInsertFixtureDataCommand } from './database/DatabaseInsertFixtureDataCommand';
import { addDatabaseInsertSeedDataCommand } from './database/DatabaseInsertSeedDataCommand';
import { addDatabaseReloadCommand } from './database/DatabaseReloadCommand';
import { addDatabaseRunMigrationsCommand } from './database/DatabaseRunMigrationsCommand';

const program = new Command();

// Database
addDatabaseInsertSeedDataCommand(program);
addDatabaseInsertFixtureDataCommand(program);
addDatabaseDropSchemasCommand(program);
addDatabaseRunMigrationsCommand(program);
addDatabaseReloadCommand(program);

program
  .hook('postAction', async () => {
    await destroyDatabaseClient();
    await destroyDatabaseMigrationClient();
    await logger.terminate();
  })
  .parse(process.argv);
