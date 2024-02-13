import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4200,
    host: '0.0.0.0',
    hmr: true,
  },
  preview: {
    port: 4300,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    // Can we instead use vite-tsconfig-paths?
    // https://www.npmjs.com/package/vite-tsconfig-paths
    alias: {
      // We need to do that it we want to have HMR working with the monorepo.
      // Make sure the order is correct! We first need to match the files and then the global namespace!
      '@moaitime/web-core/globals.css': resolve('../../packages/web-core/src/globals.css'),
      '@moaitime/web-core': resolve('../../packages/web-core/src/index.ts'),
    },
  },
});
