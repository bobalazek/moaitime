import { Command } from 'commander';

import { destroyDatabase } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';

import { addDatabaseDropSchemasCommand } from './database/DatabaseDropSchemasCommand';
import { addDatabaseGenerateMigrationCommand } from './database/DatabaseGenerateMigrationCommand';
import { addDatabaseInsertFixtureDataCommand } from './database/DatabaseInsertFixtureDataCommand';
import { addDatabaseInsertSeedDataCommand } from './database/DatabaseInsertSeedDataCommand';
import { addDatabaseReloadCommand } from './database/DatabaseReloadCommand';
import { addDatabaseRunMigrationsCommand } from './database/DatabaseRunMigrationsCommand';
import { addHealthCheckCommand } from './health/HealthCheckCommand';
import { addJobsRunnerStartCommand } from './jobs/JobsRunnerStartCommand';

const program = new Command();

// Health
addHealthCheckCommand(program);

// Database
addDatabaseInsertSeedDataCommand(program);
addDatabaseInsertFixtureDataCommand(program);
addDatabaseDropSchemasCommand(program);
addDatabaseGenerateMigrationCommand(program);
addDatabaseRunMigrationsCommand(program);
addDatabaseReloadCommand(program);

// Jobs
addJobsRunnerStartCommand(program);

program
  .hook('postAction', async () => {
    await destroyDatabase();
    await logger.terminate();
  })
  .parse(process.argv);
