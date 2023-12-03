import { join, relative, resolve, sep } from 'path';

import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import { getEnv } from '@myzenbuddy/shared-backend';

import * as schema from '../schema';

const { POSTGRESQL_URL } = getEnv();

export const databasePool = new Pool({
  connectionString: POSTGRESQL_URL,
});

export const databaseClient = drizzle(databasePool, { schema });

export const runDatabaseMigrations = async () => {
  const databasePoolClient = await databasePool.connect();
  const DIST_DELIMITER = `${sep}dist${sep}`;

  let migrationsFolder = resolve(relative(process.cwd(), join(__dirname, '..', '..', 'migrations')));
  if (migrationsFolder.includes(DIST_DELIMITER)) {
    const DIST_DIR = migrationsFolder.split(DIST_DELIMITER)[0];
    migrationsFolder = resolve(join(DIST_DIR, 'libs', 'database', 'core', 'migrations'));
  }

  try {
    await databasePoolClient.query(`CREATE SCHEMA IF NOT EXISTS public`);

    await migrate(databaseClient, { migrationsFolder: migrationsFolder });
  } finally {
    databasePoolClient.release();
  }
};

export const dropDatabaseSchemas = async () => {
  const databasePoolClient = await databasePool.connect();

  try {
    const res = await databasePoolClient.query(`
      SELECT schema_name
      FROM information_schema.schemata
      WHERE
        schema_name NOT IN ('pg_catalog', 'information_schema') AND
        schema_name NOT LIKE 'pg_toast%' AND
        schema_name NOT LIKE 'pg_temp_%'
    `);

    for (const row of res.rows) {
      await databasePoolClient.query(`DROP SCHEMA "${row.schema_name}" CASCADE`);
    }
  } finally {
    databasePoolClient.release();
  }
};
