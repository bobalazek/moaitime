import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/main.ts'],
  format: ['cjs', 'esm'],
  dts: process.env.NODE_ENV !== 'test',
  sourcemap: true,
  clean: true,
  shims: true,
});
