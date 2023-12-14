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
