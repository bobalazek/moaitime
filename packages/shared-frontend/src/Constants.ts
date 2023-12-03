export const API_URL = window?.location
  ? /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(window.location.hostname) // If it's an IP address, then we assume it's local and on the same server where ports are allowed
    ? `${window.location.protocol}//${window.location.hostname}:3636`
    : `${window.location.protocol}//${window.location.hostname}` // This is on the nginx proxy manager
  : `http://localhost:3636`;

const apiUrl = new URL(API_URL);
const wsPort = apiUrl.port ? `:${apiUrl.port}` : '';
const wsProtocol = apiUrl.protocol.replace('https', 'wss').replace('http', 'ws') || 'ws';
export const WS_URL = window?.location
  ? /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.test(window.location.hostname) // If it's an IP address, then we assume it's local and on the same server where ports are allowed
    ? `${wsProtocol}//${window.location.hostname}${wsPort}/ws`
    : `${wsProtocol}//${window.location.hostname}/ws` // This is on the nginx proxy manager
  : `ws://localhost${wsPort}/ws`;
