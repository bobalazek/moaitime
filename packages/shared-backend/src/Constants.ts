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
export const AUTH_DELETION_REQUEST_EXPIRATION_SECONDS = 60 * 60;

// Mailer
export const MAILER_FROM = 'MoaiTime Mailer <mailer@bobalazek.com>';

// Tasks & Lists
export const TASKS_MAX_PER_LIST_COUNT = 50;
export const LISTS_MAX_PER_USER_COUNT = 10;
export const LISTS_DEFAULT_NAMES = ['Inbox', 'Errands', 'Work', 'Personal'];

// Calendar
export const CALENDARS_MAX_PER_USER_COUNT = 10;
export const CALENDARS_MAX_EVENTS_PER_CALENDAR_COUNT = 500;

// Notes
export const NOTES_MAX_PER_USER_COUNT = 100;
