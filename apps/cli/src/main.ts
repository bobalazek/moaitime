import { Command } from 'commander';

import { destroyDatabase } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';

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
    await destroyDatabase();
    await logger.terminate();
  })
  .parse(process.argv);
