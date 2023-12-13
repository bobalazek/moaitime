import { App } from '@moaitime/web-core';
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import '@moaitime/web-core/globals.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
