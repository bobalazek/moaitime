import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

import { DrizzleConfig, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres'; // Tried to use "pg", but it's not really working on windows, so we need to use this one for now

import { logger } from '@moaitime/logging';
import { getEnv, ROOT_DIR } from '@moaitime/shared-backend';
import { uploader } from '@moaitime/uploader';

import * as schema from '../schema';

// Database Client
type Client = ReturnType<typeof postgres>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientConfig = postgres.Options<any>;
type Database = ReturnType<typeof drizzle<typeof schema>>;
type DatabaseConfig = DrizzleConfig<typeof schema>;

export const createDatabaseAndClient = (
  connectionUrl?: string,
  clientConfig?: ClientConfig,
  databaseConfig?: DatabaseConfig
) => {
  logger.debug(
    `[Database] Creating database client with client config: "${JSON.stringify(
      clientConfig
    )}", database config: "${JSON.stringify(databaseConfig)}" ...`
  );

  if (!connectionUrl) {
    const { POSTGRESQL_URL } = getEnv();

    const url = new URL(POSTGRESQL_URL);
    url.searchParams.delete('schema');

    connectionUrl = url.toString();
  }

  const client = postgres(connectionUrl, {
    onnotice: () => {},
    transform: {
      undefined: null,
    },
    ...clientConfig,
  });

  const database = drizzle(client, { schema, ...databaseConfig });

  return { client, database };
};

let _client: Client | undefined;
let _database: Database | undefined;
export const getDatabase = () => {
  if (!_database) {
    const { client, database } = createDatabaseAndClient();

    _client = client;
    _database = database;
  }

  return _database;
};

export const executeRawQuery = async <T extends Record<string, unknown>>(
  query: string,
  database?: Database
) => {
  if (!database) {
    database = getDatabase();
  }

  return database.execute<T>(sql.raw(query));
};

export const destroyDatabase = async () => {
  if (!_database) {
    return;
  }

  logger.debug('[Database] Destroying database clients ...');

  await _client?.end();
  _client = undefined;
  _database = undefined;

  await _migrationClient?.end();
  _migrationDatabase = undefined;

  logger.trace('[Database] Database clients destroyed');
};

// Database Migration
let _migrationClient: Client | undefined;
let _migrationDatabase: Database | undefined;
export const getMigrationDatabase = () => {
  if (!_migrationDatabase) {
    const { client, database } = createDatabaseAndClient(undefined, {
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
    logger.info('[Database] Running database migrations ...');

    let migrationsFolder = resolve(join(ROOT_DIR, 'packages', 'database-core', 'migrations'));

    logger.debug(`[Database] Migrations folder: "${migrationsFolder}"`);

    // Just a fallback for docker
    if (!existsSync(migrationsFolder) && existsSync('/app')) {
      migrationsFolder = resolve(
        join('/app', 'node_modules', '@moaitime', 'database-core', 'migrations')
      );

      logger.debug(
        `[Database] Migrations folder not found, but seems to be the docker environment. Folder: "${migrationsFolder}"`
      );
    }

    if (!existsSync(migrationsFolder)) {
      throw new Error(`[Database] Migrations folder not found: "${migrationsFolder}"`);
    }

    const database = getMigrationDatabase();

    await database.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS "public"`));

    await migrate(database, {
      migrationsFolder,
    });

    logger.info('[Database] Database migrations ran successfully');
  } catch (error) {
    logger.error(error, '[Database] Database migrations failed');

    throw error;
  }
};

// Database Schema
export const dropDatabaseSchema = async () => {
  try {
    logger.info('[Database] Dropping database schema ...');

    const database = getMigrationDatabase();

    await database.execute(sql.raw(`DROP SCHEMA IF EXISTS "drizzle" CASCADE`));
    await database.execute(sql.raw(`DROP SCHEMA IF EXISTS "public" CASCADE`));

    logger.info('Database drop schemas ran successfully');
  } catch (error) {
    logger.error(error, 'Database drop schemas failed');

    throw error;
  }
};

// Database Backup
export const doDatabaseBackup = async (fileName?: string) => {
  logger.info(`[Database] Doing a database backup ...`);

  const dateString = new Date().toISOString().replace(/:/g, '-');
  const { database, hostname, username, password, port } = getPostgreSQLUrlComponents();
  const backupFileName = fileName ?? `${database}-${dateString}.custom.gz`;
  const backupFilePath = `${tmpdir()}/${backupFileName}`;

  const pgDumpCommand = `pg_dump --verbose --format=custom --host=${hostname} --username=${username} --dbname=${database} --port=${port} | gzip > ${backupFilePath}`;

  logger.debug(
    `[Database] Backup file path: "${backupFilePath}". Command: "${pgDumpCommand}". Executing command ...`
  );

  const pgDumpProcess = spawn('sh', ['-c', pgDumpCommand], {
    env: {
      ...process.env,
      PGPASSWORD: password,
    },
  });

  await new Promise<void>((resolve, reject) => {
    pgDumpProcess.stdout.on('data', (data) => {
      logger.debug(`[Database] pg_dump stdout: ${data.toString()}`);
    });
    pgDumpProcess.stderr.on('data', (data) => {
      logger.debug(`[Database] pg_dump stderr: ${data.toString()}`);
    });
    pgDumpProcess.on('error', (error) => {
      logger.error(error, `[Database] pg_dump error:`);

      reject();
    });
    pgDumpProcess.on('exit', (code) => {
      logger.info(`[Database] pg_dump child process exited with code ${code}`);

      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });

  const { POSTGRESQL_BACKUP_BUCKET_URL } = getEnv();
  if (POSTGRESQL_BACKUP_BUCKET_URL) {
    logger.debug(`[Database] Uploading backup to bucket ...`);

    const backupFileNameSplit = backupFilePath.split('/');
    const backupFileName = backupFileNameSplit[backupFileNameSplit.length - 1];
    await uploader.uploadToBucket(
      POSTGRESQL_BACKUP_BUCKET_URL,
      backupFilePath,
      'application/gzip',
      backupFileName
    );

    logger.debug(`[Database] Backup successfully uploaded to bucket`);
  }

  logger.debug(`[Database] Backup successfully finished and saved to "${backupFilePath}"`);

  return backupFilePath;
};

export const doDatabaseRecovery = async (fileName: string, confirm: boolean) => {
  logger.info(`[Database] Doing a database recovery ...`);

  const { POSTGRESQL_BACKUP_BUCKET_URL } = getEnv();
  if (!POSTGRESQL_BACKUP_BUCKET_URL) {
    throw new Error(`[Database] POSTGRESQL_BACKUP_BUCKET_URL is not defined`);
  }

  if (!confirm) {
    logger.error(
      `[Database] You need to confirm the recovery by passing the "--confirm" arguments at the end`
    );

    return;
  }

  const backupFilePath = `${tmpdir()}/${fileName}`;

  if (!existsSync(backupFilePath)) {
    logger.debug(`[Database] Downloading backup from bucket ...`);

    await uploader.downloadFromBucket(POSTGRESQL_BACKUP_BUCKET_URL, fileName, backupFilePath);

    logger.debug(`[Database] Backup successfully downloaded from bucket`);
  } else {
    logger.debug(`[Database] Backup already exists on disk. Skipping download from bucket ...`);
  }

  const { database, hostname, username, password, port } = getPostgreSQLUrlComponents();
  const unzippedBackupFilePath = backupFilePath.replace('.gz', '');
  const pgRestoreCommand = `pg_restore --verbose --clean --if-exists --jobs=4 --format=custom --host=${hostname} --username=${username} --port=${port} --dbname=${database} "${unzippedBackupFilePath}"`;
  const fullPgRestoreCommand = `gunzip -f "${backupFilePath}" && ${pgRestoreCommand}`;

  logger.debug(
    `[Database] Backup file path: "${backupFilePath}". Command: "${fullPgRestoreCommand}". Executing command ...`
  );

  const pgRestoreProcess = spawn('sh', ['-c', fullPgRestoreCommand], {
    env: {
      ...process.env,
      PGPASSWORD: password,
    },
  });

  await new Promise<void>((resolve, reject) => {
    pgRestoreProcess.stdout.on('data', (data) => {
      logger.debug(`[Database] pg_restore stdout: ${data.toString()}`);
    });
    pgRestoreProcess.stderr.on('data', (data) => {
      logger.debug(`[Database] pg_restore stderr: ${data.toString()}`);
    });
    pgRestoreProcess.on('error', (error) => {
      logger.error(error, `[Database] pg_restore error:`);

      reject();
    });
    pgRestoreProcess.on('exit', (code) => {
      logger.debug(`[Database] pg_restore child process exited with code ${code}`);

      if (code === 0) {
        resolve();
      } else {
        reject();
      }
    });
  });

  logger.info(`[Database] Recovery successfully finished`);

  return backupFilePath;
};

const getPostgreSQLUrlComponents = () => {
  const { POSTGRESQL_URL } = getEnv();

  // Need to replace "postgres://" with "http://" because the URL() class doesn't support "postgres://"
  const postgresqlUrl = POSTGRESQL_URL.replace('postgres://', 'http://').replace(
    'postgresql://',
    'http://'
  );

  const url = new URL(postgresqlUrl);
  const hostname = url.hostname;
  const port = url.port;
  const username = decodeURIComponent(url.username);
  const password = decodeURIComponent(url.password);
  const database = url.pathname.replace('/', '');

  return {
    hostname,
    port,
    username,
    password,
    database,
  };
};
