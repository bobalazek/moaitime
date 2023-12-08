import { join, relative, resolve, sep } from 'path';

import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import { getEnv } from '@myzenbuddy/shared-backend';
import { logger } from '@myzenbuddy/shared-logging';

import * as schema from '../schema';

const { POSTGRESQL_URL } = getEnv();

export const databasePool = new Pool({
  connectionString: POSTGRESQL_URL,
});

export const databaseClient = drizzle(databasePool, { schema });

export const runDatabaseMigrations = async () => {
  logger.info('Running database migrations ...');

  const DIST_DELIMITER = `${sep}dist${sep}`;

  let migrationsFolder = resolve(relative(process.cwd(), join(__dirname, '..', 'migrations')));
  if (migrationsFolder.includes(DIST_DELIMITER)) {
    const DIST_DIR = migrationsFolder.split(DIST_DELIMITER)[0];
    migrationsFolder = resolve(join(DIST_DIR, 'libs', 'database-core', 'migrations'));
  }

  await databaseClient.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS public`));

  await migrate(databaseClient, { migrationsFolder: migrationsFolder });

  logger.info('Database migrations ran successfully');
};

export const dropDatabaseSchemas = async () => {
  logger.info('Dropping database schemas ...');

  const res = await databaseClient.execute(
    sql.raw(`
    SELECT schema_name
    FROM information_schema.schemata
    WHERE
      schema_name NOT IN ('pg_catalog', 'information_schema') AND
      schema_name NOT LIKE 'pg_toast%' AND
      schema_name NOT LIKE 'pg_temp_%'
  `)
  );

  for (const row of res.rows) {
    await databaseClient.execute(sql.raw(`DROP SCHEMA "${row.schema_name}" CASCADE`));
  }

  logger.info('Database drop schemas ran successfully');
};
