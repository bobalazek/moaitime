import { defineConfig } from 'tsup';

const whitelistPrefixes = ['OAUTH_GOOGLE_CLIENT_ID'];

export default defineConfig(async (options) => {
  // A very fucking stupid workaround, as for some reason I can't import the shared-backend library the normal way ...
  const { loadEnvironmentVariables } = await import(
    __dirname + '/node_modules/@moaitime/shared-backend/dist/index.js'
  );

  loadEnvironmentVariables();

  const customEnv: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (whitelistPrefixes.some((prefix) => key.startsWith(prefix))) {
      customEnv[key] = value as string;
    }
  }

  const env = {
    ...options.env,
    ...customEnv,
  };

  return {
    ...options,
    env,
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: process.env.GENERATE_DTS === 'true',
    sourcemap: true,
    clean: true,
    shims: true,
  };
});
