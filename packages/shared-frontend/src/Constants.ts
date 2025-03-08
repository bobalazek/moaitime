// Types
declare global {
  interface Window {
    globals: Record<string, unknown>;
  }
}

// API URL
export const API_URL =
  (typeof window !== 'undefined' && window?.globals ? window?.globals?.['API_URL'] : null) ||
  (typeof window !== 'undefined' && window?.location
    ? `${window.location.protocol}//${window.location.hostname}:3636`
    : `http://localhost:3636`);

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID =
  (typeof window !== 'undefined' && window?.globals
    ? window?.globals?.['OAUTH_GOOGLE_CLIENT_ID']
    : null) || '';
