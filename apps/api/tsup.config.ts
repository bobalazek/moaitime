import { readdirSync } from 'fs';
import { join } from 'path';

import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  let onSuccess: (() => Promise<() => Promise<void>>) | string | undefined = undefined;
  let watch: string[] | undefined = undefined;
  // We need to use the "options.env.TSUP_WATCH" instead of directly using "options.watch"
  // because it seems that if watch is provided, that will always take precedence
  // over the watch variable we provide.
  if (options.env?.TSUP_WATCH) {
    // Trying to solve the following issue:
    // https://github.com/egoist/tsup/issues/999
    // This is a hacky workaround to trigger a restart the web server if a dependency changes,
    // as at the time of writing this, it does not seem to work otherwise.

    watch = ['.'];

    const packages = readdirSync(join(__dirname, '../../packages'));
    for (const packageName of packages) {
      // TODO: we can only watch the packages that have @moaitime/api as dependency

      watch.push(join(__dirname, `../../packages/${packageName}/dist/**/index.{js,mjs}`));
    }

    // We needed to add this sleep,
    // so that the websocket has time to close in HMR mode,
    // before the server restarts.
    onSuccess = `node -e "function sleep() { return new Promise(resolve => setTimeout(resolve, 2000)); }; sleep();" && node dist/main.js`;

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
