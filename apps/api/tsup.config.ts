import { readdirSync } from 'fs';
import { join } from 'path';

import { defineConfig } from 'tsup';

export default defineConfig((options) => {
  let watch: string[] | undefined = undefined;
  if (options.watch) {
    // This is a hacky workaround to trigger a restart the web server if a dependency changes,
    // as at the time of writing this, it does not seem to work otherwise.

    watch = ['.'];

    const packages = readdirSync(join(__dirname, '../../packages'));
    for (const packageName of packages) {
      watch.push(join(__dirname, `../../packages/${packageName}/dist/**/*.{js,mjs}`));
    }
  }

  return {
    entry: ['src/main.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
    shims: true,
    watch,
    /*
    // Prefferably, we would like to use this, but it does not seem to work at the moment,
    // so for now we will still use the --onSuccess="node ./dist/main.js" flag.
    async onSuccess() {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { bootstrap } = await import('./dist/main.mjs');

      const app = await bootstrap();

      return () => {
        app.close();
      };
    },
    */
  };
});
