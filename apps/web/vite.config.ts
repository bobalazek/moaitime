import { resolve } from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// import tsconfigPaths from 'vite-tsconfig-paths';

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
  plugins: [react() /*, tsconfigPaths()*/],
  resolve: {
    // tsconfigpaths are not really working,
    // as for some reason it does not recognize the newly created or moved files
    alias: {
      // We need to do that it we want to have HMR working with the monorepo.
      '@moaitime/web-core': resolve('../../packages/web-core/src/index.ts'),
    },
  },
});
