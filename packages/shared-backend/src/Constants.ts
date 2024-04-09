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

// Tasks, Lists & Tags
export const LISTS_DEFAULT_NAMES = ['Inbox', 'Errands', 'Work', 'Personal', 'World Domination'];
export const TASKS_DEFAULT_ENTRIES = {
  Inbox: ['Welcome to MoaiTime!'],
  Errands: ['Buy groceries', 'Pick up laundry'],
  Work: ['Have a coffee', 'Do something', 'Prepare to leave early'],
  Personal: ['Go for a walk', 'Go to the gym', 'Go to sleep'],
  'World Domination': [
    'Practice your evil laugh',
    'Hack into the mainframe',
    'Beat your arch-enemy',
    'Take over the world',
  ],
};

// Queue
export const QUEUE_WORKERS_SHARED_QUEUE_NAME = 'shared-queue';
