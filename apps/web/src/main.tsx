import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@moaitime/web-core';

import '@moaitime/web-core/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
