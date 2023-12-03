import { join, resolve } from 'path';

import { path as rootPath } from 'app-root-path';

// Environment
export const AVAILABLE_NODE_ENVS = ['production', 'staging', 'development', 'test'] as const;

// Paths
export const ROOT_DIR = rootPath;
export const LOGS_DIR = resolve(join(ROOT_DIR, 'logs'));

// Auth
export const AUTH_PASSWORD_RESET_REQUEST_EXPIRATION_SECONDS = 60 * 15;
export const AUTH_EMAIL_CONFIRMATION_REQUEST_EXPIRATION_SECONDS = 60 * 15;
