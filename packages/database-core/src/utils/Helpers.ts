import { join, relative, resolve, sep } from 'path';

import { DrizzleConfig, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres'; // Tried to use "pg", but it's not really working on windows, so we need to use this one for now

import { getEnv } from '@myzenbuddy/shared-backend';
import { logger } from '@myzenbuddy/shared-logging';

import * as schema from '../schema';

// Database Client
type Client = ReturnType<typeof postgres>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientConfig = postgres.Options<any>;
type Database = ReturnType<typeof drizzle<typeof schema>>;
type DatabaseConfig = DrizzleConfig<typeof schema>;

export const createDatabaseClients = (
  clientConfig?: ClientConfig,
  databaseConfig?: DatabaseConfig
) => {
  logger.debug(
    `Creating database client with client config: "${JSON.stringify(
      clientConfig
    )}", database config: "${JSON.stringify(databaseConfig)}" ...`
  );

  const { POSTGRESQL_URL } = getEnv();
  const url = new URL(POSTGRESQL_URL);
  url.searchParams.delete('schema');

  const client = postgres(url.toString(), { onnotice: () => {}, ...clientConfig });
  const database = drizzle(client, { schema, ...databaseConfig });

  return { client, database };
};

let _client: Client | undefined;
let _database: Database | undefined;
export const getDatabase = () => {
  if (!_database) {
    const { client, database } = createDatabaseClients();

    _client = client;
    _database = database;
  }

  return _database;
};

export const destroyDatabase = async () => {
  if (!_database) {
    return;
  }

  logger.debug('Destroying database clients ...');

  await _client?.end();
  _client = undefined;
  _database = undefined;

  await _migrationClient?.end();
  _migrationDatabase = undefined;

  logger.trace('Database clients destroyed');
};

// Migration Database
let _migrationClient: Client | undefined;
let _migrationDatabase: Database | undefined;
export const getMigrationDatabase = () => {
  if (!_migrationDatabase) {
    const { client, database } = createDatabaseClients({
      max: 1,
    });

    _migrationClient = client;
    _migrationDatabase = database;
  }

  return _migrationDatabase;
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

    const database = getMigrationDatabase();

    await database.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "public"`));

    await migrate(database, {
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

    const database = await getMigrationDatabase();

    await database.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE`));
    await database.execute(sql.raw(`DROP SCHEMA IF EXISTS "public" CASCADE`));

    logger.info('Database drop schemas ran successfully');
  } catch (error) {
    logger.error(error, 'Database drop schemas failed');

    throw error;
  }
};
