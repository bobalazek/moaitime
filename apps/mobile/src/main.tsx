import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import { App } from '@moaitime/web-core';

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
