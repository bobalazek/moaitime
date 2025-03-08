// Types
declare global {
  interface Window {
    globals: Record<string, unknown>;
  }
}

// API URL
export const API_URL =
  (typeof window !== 'undefined' && window?.globals?.['API_URL']) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.API_URL) ||
  `http://localhost:3636`;

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID =
  (typeof window !== 'undefined' && window?.globals?.['OAUTH_GOOGLE_CLIENT_ID']) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.OAUTH_GOOGLE_CLIENT_ID) ||
  '';
