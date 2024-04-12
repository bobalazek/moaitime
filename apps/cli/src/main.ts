import { Command } from 'commander';

import { destroyDatabase } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';

import { addDatabaseBackupCommand } from './database/DatabaseBackupCommand';
import { addDatabaseDropSchemasCommand } from './database/DatabaseDropSchemasCommand';
import { addDatabaseInsertFixtureDataCommand } from './database/DatabaseInsertFixtureDataCommand';
import { addDatabaseInsertSeedDataCommand } from './database/DatabaseInsertSeedDataCommand';
import { addDatabaseMigrationsGenerateCommand } from './database/DatabaseMigrationsGenerateCommand';
import { addDatabaseMigrationsRunCommand } from './database/DatabaseMigrationsRunCommand';
import { addDatabaseRecoverCommand } from './database/DatabaseRecoverCommand';
import { addDatabaseReloadCommand } from './database/DatabaseReloadCommand';
import { addHealthCheckCommand } from './health/HealthCheckCommand';
import { addJobsRunnerStartCommand } from './jobs/JobsRunnerStartCommand';

const program = new Command();

// Health
addHealthCheckCommand(program);

// Database
addDatabaseInsertSeedDataCommand(program);
addDatabaseInsertFixtureDataCommand(program);
addDatabaseDropSchemasCommand(program);
addDatabaseMigrationsGenerateCommand(program);
addDatabaseMigrationsRunCommand(program);
addDatabaseBackupCommand(program);
addDatabaseRecoverCommand(program);
addDatabaseReloadCommand(program);

// Jobs
addJobsRunnerStartCommand(program);

program
  .hook('postAction', async () => {
    await destroyDatabase();
    await logger.terminate();
  })
  .parse(process.argv);
