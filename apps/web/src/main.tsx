import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@moaitime/web-core';

import '@moaitime/web-core/globals.css';

import { API_URL } from '@moaitime/shared-common';

if (import.meta.hot) {
  // Sometimes the API is not available while it's being rebuild on a change.
  // We want to try to try to ping the API until it's available.
  let apiReachableAttempts = 0;
  const checkIfApiIsAvailable = async () => {
    if (apiReachableAttempts > 10) {
      return;
    }

    try {
      await fetch(`${API_URL}/health`);

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

  import.meta.hot.on('vite:beforeFullReload', () => {
    console.log('beforefullrel');
  });
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
