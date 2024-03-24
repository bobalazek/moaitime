// General
export const APP_VERSION = '0.1.0';
export const APP_VERSION_HEADER = 'X-App-Version';

// Calendar
export const CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX = 48;
export const CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX = 2;
export const CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT = 6;

// Mood
export const MOOD_SCORES = [-2, -1, 0, 1, 2];

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID = 'google-client-id'; //TODO

// Web URL
export const WEB_URL =
  typeof window !== 'undefined' && window?.location
    ? `${window.location.protocol}//${window.location.hostname}`
    : `http://localhost:4200`; // TODO: should use WEB_BASE_URL

// API URL
export const API_URL =
  typeof window !== 'undefined' && window?.location
    ? `${window.location.protocol}//${window.location.hostname}:3636`
    : `http://localhost:3636`; // TODO: same here. Should use API_BASE_URL

// WS URL
const apiUrl = new URL(API_URL);
const wsPort = apiUrl.port ? `:${apiUrl.port}` : '';
const wsProtocol = apiUrl.protocol.replace('https', 'wss').replace('http', 'ws') || 'ws';
export const WS_URL =
  typeof window !== 'undefined' && window?.location
    ? `${wsProtocol}//${window.location.hostname}${wsPort}/ws`
    : `ws://localhost${wsPort}/ws`;
