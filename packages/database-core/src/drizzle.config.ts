import { join, relative } from 'path';
import type { Config } from 'drizzle-kit';

import { getEnv } from '@myzenbuddy/shared-backend';

const currentWorkingDir = process.cwd();
const { POSTGRESQL_URL } = getEnv();

export default {
  schema: relative(currentWorkingDir, join(__dirname, 'schema.ts')),
  out: relative(currentWorkingDir, join(__dirname, '..', 'migrations')),
  driver: 'pg',
  dbCredentials: {
    connectionString: POSTGRESQL_URL,
  },
} satisfies Config;
