import { Command } from 'commander';

import { destroyDatabase } from '@moaitime/database-core';
import { logger } from '@moaitime/logging';
import { setEnv } from '@moaitime/shared-backend';

import { addDatabaseBackupCommand } from './database/DatabaseBackupCommand';
import { addDatabaseFixturesInsertCommand } from './database/DatabaseFixturesInsertCommand';
import { addDatabaseMigrationsGenerateCommand } from './database/DatabaseMigrationsGenerateCommand';
import { addDatabaseMigrationsRunCommand } from './database/DatabaseMigrationsRunCommand';
import { addDatabaseRecoverCommand } from './database/DatabaseRecoverCommand';
import { addDatabaseReloadCommand } from './database/DatabaseReloadCommand';
import { addDatabaseSchemaDropCommand } from './database/DatabaseSchemaDropCommand';
import { addDatabaseSeedsInsertCommand } from './database/DatabaseSeedsInsertCommand';
import { addDatabaseSeedsPublicCalendarsUpdateCommand } from './database/DatabaseSeedsPublicCalendarsUpdateCommand';
import { addHealthCheckCommand } from './health/HealthCheckCommand';
import { addJobsRunnerStartCommand } from './jobs/JobsRunnerStartCommand';

const program = new Command();

// Health
addHealthCheckCommand(program);

// Database
addDatabaseSeedsInsertCommand(program);
addDatabaseSeedsPublicCalendarsUpdateCommand(program);
addDatabaseFixturesInsertCommand(program);
addDatabaseSchemaDropCommand(program);
addDatabaseMigrationsGenerateCommand(program);
addDatabaseMigrationsRunCommand(program);
addDatabaseBackupCommand(program);
addDatabaseRecoverCommand(program);
addDatabaseReloadCommand(program);

// Jobs
addJobsRunnerStartCommand(program);

program
  .hook('preAction', async () => {
    setEnv({
      SERVICE_NAME: 'cli',
    });

    logger.reset({
      base: {
        service: 'cli',
      },
    });
  })
  .hook('postAction', async () => {
    await destroyDatabase();
    await logger.terminate();
  })
  .parse(process.argv);
