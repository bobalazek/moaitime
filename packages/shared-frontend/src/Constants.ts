// Types
declare global {
  interface Window {
    globals: Record<string, unknown>;
  }
}

// API URL
export const API_URL =
  window?.globals?.['API_URL'] || import.meta.env?.API_URL || `http://localhost:3636`;

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID =
  window?.globals?.['OAUTH_GOOGLE_CLIENT_ID'] || import.meta.env?.OAUTH_GOOGLE_CLIENT_ID || '';
