// API URL
export const API_URL =
  import.meta.env.API_BASE_URL ??
  (typeof window !== 'undefined' && window?.location
    ? `${window.location.protocol}//${window.location.hostname}:3636`
    : `http://localhost:3636`);

// OAuth
export const OAUTH_GOOGLE_CLIENT_ID =
  import.meta.env.OAUTH_GOOGLE_CLIENT_ID ?? 'oauth-google-client-id';
