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

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID =
  import.meta.env.OAUTH_GOOGLE_CLIENT_ID ?? 'oauth-google-client-id';
