import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 4200,
    host: 'localhost',
    hmr: true,
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react()],
});
