import { join, relative, resolve, sep } from 'path';

import { DrizzleConfig, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

import { getEnv } from '@myzenbuddy/shared-backend';
import { logger } from '@myzenbuddy/shared-logging';

import * as schema from '../schema';

// Database Client
type DatabaseClient = ReturnType<typeof drizzle<typeof schema>>;

export const createDatabaseClient = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postgresConfig?: postgres.Options<any>,
  databaseConfig?: DrizzleConfig<typeof schema>
) => {
  logger.debug(
    `Creating database client with pool config: "${JSON.stringify(
      postgresConfig
    )}", drizzleConfig: "${JSON.stringify(databaseConfig)}" ...`
  );

  const { POSTGRESQL_URL } = getEnv();
  const url = new URL(POSTGRESQL_URL);
  url.searchParams.delete('schema');

  const postgresClient = postgres(url.toString(), postgresConfig);
  const databaseClient = drizzle(postgresClient, { schema, ...databaseConfig });

  return { postgresClient, databaseClient };
};

let _postgresClient: postgres.Sql | undefined;
let _databaseClient: DatabaseClient | undefined;
export const getDatabaseClient = () => {
  if (!_databaseClient) {
    const { postgresClient, databaseClient } = createDatabaseClient();

    _postgresClient = postgresClient;
    _databaseClient = databaseClient;
  }

  return _databaseClient;
};

export const destroyDatabaseClient = async () => {
  if (!_databaseClient) {
    return;
  }

  logger.debug('Destroying database client ...');

  await _postgresClient?.end();
  _postgresClient = undefined;
  _databaseClient = undefined;

  logger.trace('Database client destroyed');
};

// Database Migration Client
let _migrationPostgresClient: postgres.Sql | undefined;
let _migrationDatabaseClient: DatabaseClient | undefined;
export const getDatabaseMigrationClient = () => {
  if (!_migrationDatabaseClient) {
    const { postgresClient, databaseClient } = createDatabaseClient({
      max: 1,
    });

    _migrationPostgresClient = postgresClient;
    _migrationDatabaseClient = databaseClient;
  }

  return _migrationDatabaseClient;
};

export const destroyDatabaseMigrationClient = async () => {
  if (!_migrationDatabaseClient) {
    return;
  }

  logger.debug('Destroying database migration client ...');

  await _migrationPostgresClient?.end();
  _migrationPostgresClient = undefined;
  _migrationDatabaseClient = undefined;

  logger.trace('Database migration client destroyed');
};

// Database Migrations
export const runDatabaseMigrations = async () => {
  try {
    logger.info('Running database migrations ...');

    const DIST_DELIMITER = `${sep}dist${sep}`;

    let migrationsFolder = resolve(relative(process.cwd(), join(__dirname, '..', 'migrations')));
    if (migrationsFolder.includes(DIST_DELIMITER)) {
      const DIST_DIR = migrationsFolder.split(DIST_DELIMITER)[0];
      migrationsFolder = resolve(join(DIST_DIR, 'libs', 'database-core', 'migrations'));
    }

    await getDatabaseMigrationClient().execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "public"`));

    await migrate(getDatabaseMigrationClient(), {
      migrationsFolder,
    });

    logger.info('Database migrations ran successfully');
  } catch (error) {
    logger.error(error, 'Database migrations failed');

    throw error;
  }
};

// Database Schema
export const dropDatabaseSchema = async () => {
  try {
    logger.info('Dropping database schema ...');

    await getDatabaseMigrationClient().execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE`));
    await getDatabaseMigrationClient().execute(sql.raw(`DROP SCHEMA IF EXISTS "public" CASCADE`));

    logger.info('Database drop schemas ran successfully');
  } catch (error) {
    logger.error(error, 'Database drop schemas failed');

    throw error;
  }
};
