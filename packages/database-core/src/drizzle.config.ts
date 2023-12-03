import { join, relative } from 'path';
import type { Config } from 'drizzle-kit';

import { getEnv } from '@myzenbuddy/shared-backend';

const currentWorkingDir = process.cwd();

export default {
  schema: relative(currentWorkingDir, join(__dirname, 'schema.ts')),
  out: relative(currentWorkingDir, join(__dirname, '..', 'migrations')),
  driver: 'pg',
  dbCredentials: {
    connectionString: getEnv().POSTGRESQL_URL,
  },
} satisfies Config;
