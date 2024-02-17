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

      // That is not really working, because now, for some reason Vite doesn't recognize the changes
      // to the packages that are not being watched. I think we will need to fix that there
      if (packageName.startsWith('web-')) {
        //continue;
      }

      watch.push(join(__dirname, `../../packages/${packageName}/dist/**/index.{js,mjs}`));
    }

    // TODO
    // At the moment we still have issues with websockets, where they do not close correctly and keep the port open.
    onSuccess = `node dist/main.js`;

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
    clean: false, // MUST be false, otherwise the assets do not work
    shims: true,
    watch,
    onSuccess,
    publicDir: 'assets',
  };
});
