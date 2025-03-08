// Types
declare global {
  interface Window {
    globals: Record<string, unknown>;
  }
}

const isWindowDefined = typeof window !== 'undefined';

// API URL
export const API_URL =
  (isWindowDefined && window?.globals?.['API_URL']) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.API_URL) ||
  `http://localhost:3636`;

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID =
  (isWindowDefined && window?.globals?.['OAUTH_GOOGLE_CLIENT_ID']) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.OAUTH_GOOGLE_CLIENT_ID) ||
  '';
