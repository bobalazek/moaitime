import { readdirSync } from 'fs';
import { join } from 'path';

import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  let onSuccess: (() => Promise<() => Promise<void>>) | string | undefined = undefined;
  let watch: string[] | undefined = undefined;
  if (options.watch) {
    // This is a hacky workaround to trigger a restart the web server if a dependency changes,
    // as at the time of writing this, it does not seem to work otherwise.

    watch = ['.'];

    const packages = readdirSync(join(__dirname, '../../packages'));
    for (const packageName of packages) {
      watch.push(join(__dirname, `../../packages/${packageName}/dist/index.js`));
    }

    onSuccess = 'node dist/main.js';

    /*
    // TODO: fix, as it's not working at the moment
    onSuccess = async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { bootstrap } = await import('./dist/main.mjs');

      const app = await bootstrap();

      return async () => {
        await app.close();
      };
    };
    */
  }

  return {
    entry: ['src/main.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    shims: true,
    watch,
    onSuccess,
  };
});
