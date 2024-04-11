import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { API_URL } from '@moaitime/shared-frontend';
import { App } from '@moaitime/web-core';

if (import.meta.hot) {
  // Sometimes the API is not available while it's being rebuild on a change.
  // We want to try to try to ping the API until it's available.
  let apiReachableAttempts = 0;
  const checkIfApiIsAvailable = async () => {
    if (apiReachableAttempts > 10) {
      return;
    }

    try {
      await fetch(`${API_URL}/api/health`);

      if (apiReachableAttempts > 0) {
        window.location.reload();
      }

      apiReachableAttempts = 0;

      return true;
    } catch (error) {
      setTimeout(checkIfApiIsAvailable, 1000);

      return false;
    } finally {
      apiReachableAttempts++;
    }
  };

  checkIfApiIsAvailable();

  // Kind of the only way to fix the issue where the websocket reconnects too soon,
  // causing the API not terminate properly.
  import.meta.hot.on('vite:beforeUpdate', () => {
    window.dispatchEvent(new CustomEvent('vite:beforeUpdate'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) {
    return;
  }

  preloader.style.opacity = '0';
  setTimeout(() => {
    preloader.remove();
  }, 1000);
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
