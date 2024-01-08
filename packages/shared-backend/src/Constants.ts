import { join, resolve } from 'path';

import { path as rootPath } from 'app-root-path';

// Environment
export const AVAILABLE_NODE_ENVS = ['production', 'staging', 'development', 'test'] as const;

// Paths
export const ROOT_DIR = rootPath;
export const LOGS_DIR = resolve(join(ROOT_DIR, 'logs'));
export const TMP_USER_DATA_EXPORTS_DIR = resolve(join(ROOT_DIR, 'tmp', 'user-data-exports'));

// Auth
export const AUTH_PASSWORD_RESET_REQUEST_EXPIRATION_SECONDS = 60 * 15;
export const AUTH_EMAIL_CONFIRMATION_REQUEST_EXPIRATION_SECONDS = 60 * 15;
export const AUTH_DELETION_REQUEST_EXPIRATION_SECONDS = 60 * 60;

export const AUTH_DATA_EXPORT_REQUEST_EXPIRATION_SECONDS = 60 * 60 * 6; // How long until we can request the next data export again
export const AUTH_DATA_EXPORT_FILE_EXPIRATION_SECONDS = 60 * 60 * 24; // How long until the data export zip file expires
export const AUTH_DELETION_HARD_DELETE_SECONDS = 60 * 60 * 24 * 30;

// Mailer
export const MAILER_FROM = 'MoaiTime Mailer <mailer@bobalazek.com>';

// Tasks, Lists & Tags
export const LISTS_DEFAULT_NAMES = ['Inbox', 'Errands', 'Work', 'Personal'];

// Queue
export const QUEUE_WORKERS_SHARED_QUEUE_NAME = 'shared-queue';
