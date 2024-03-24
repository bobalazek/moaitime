import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'esm'],
  dts: process.env.GENERATE_DTS === 'true',
  sourcemap: true,
  clean: true,
  shims: true,
});
