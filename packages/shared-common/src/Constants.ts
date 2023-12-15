// General
// Calendar
export const CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX = 48;
export const CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX = 2;
export const CALENDAR_MONTHLY_VIEW_DAY_ENTRIES_COUNT_LIMIT = 4;

// URLs
// Web URL
export const WEB_URL =
  typeof window !== 'undefined' && window?.location
    ? `${window.location.protocol}//${window.location.hostname}`
    : `http://localhost:4200`;

// API URL
export const API_URL =
  typeof window !== 'undefined' && window?.location
    ? `${window.location.protocol}//${window.location.hostname}:3636`
    : `http://localhost:3636`;

// WS URL
const apiUrl = new URL(API_URL);
const wsPort = apiUrl.port ? `:${apiUrl.port}` : '';
const wsProtocol = apiUrl.protocol.replace('https', 'wss').replace('http', 'ws') || 'ws';
export const WS_URL =
  typeof window !== 'undefined' && window?.location
    ? `${wsProtocol}//${window.location.hostname}${wsPort}/ws`
    : `ws://localhost${wsPort}/ws`;
