import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
  plugins: [react(), tsconfigPaths()],
});
