import { join } from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig((options) => {
  const envDir = join(__dirname, '..', '..');
  const envPrefix = ['VITE_', 'OAUTH_GOOGLE_CLIENT_ID', 'WEB_BASE_URL', 'API_BASE_URL'];

  return {
    ...options,
    server: {
      port: 4200,
      host: '0.0.0.0',
      hmr: true,
      fs: {
        // https://github.com/vitejs/vite/issues/15784
        cachedChecks: false,
      },
    },
    preview: {
      port: 4300,
      host: '0.0.0.0',
    },
    plugins: [react(), tsconfigPaths()],
    envDir,
    envPrefix,
  };
});
