import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
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
});
