import { z } from 'zod';

import { AVAILABLE_NODE_ENVS } from './Constants';
import { loadEnvironmentVariables } from './utils/Helpers';

const { NODE_ENV } = loadEnvironmentVariables();

export const envSchema = z.object({
  NODE_ENV: z.enum(AVAILABLE_NODE_ENVS).default(NODE_ENV as (typeof AVAILABLE_NODE_ENVS)[number]),
  SERVICE_NAME: z.string().default('unknown_service'),
  LOGGER_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('trace'),
  LOGGER_FORCE_JSON_OUTPUT: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .default('false'),
  LOGGER_WRITE_TO_LOG_FILES: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .default('false'),
  POSTGRESQL_URL: z.string().url().min(1),
  REDIS_URL: z.string().url().min(1),
  RABBITMQ_URL: z.string().url().min(1),
  SMTP_URL: z.string().url().min(1),
  USER_DATA_EXPORTS_BUCKET_URL: z.string().url().min(1),
  USER_AVATARS_BUCKET_URL: z.string().url().min(1),
  API_PORT: z.coerce.number().default(3636),
  WEB_BASE_URL: z.string().url().min(1),
});

export type Env = z.infer<typeof envSchema>;

let _cachedEnv: Env | null = null;
export const getEnv = () => {
  if (_cachedEnv === null) {
    _cachedEnv = envSchema.parse(process.env);
  }

  return _cachedEnv;
};

export const setEnv = (env: Partial<Env>) => {
  if (env.NODE_ENV) {
    throw new Error('Cannot change the environment variables after the application has started');
  }

  for (const key of Object.keys(env)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.env[key] = env[key as keyof Env] as any;
  }

  return resetEnv();
};

export const resetEnv = () => {
  _cachedEnv = null;

  return getEnv();
};
