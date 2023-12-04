import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@myzenbuddy/web-core';

import '@myzenbuddy/web-core/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
