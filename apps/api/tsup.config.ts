import { spawn } from 'child_process';
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

      if (packageName.startsWith('web-')) {
        continue;
      }

      watch.push(join(__dirname, `../../packages/${packageName}/dist/**/index.{js,mjs}`));
    }

    onSuccess = async () => {
      const childProcess = spawn('node', ['dist/main.js'], {
        shell: true,
      });
      childProcess.stdout.pipe(process.stdout);
      childProcess.stderr.pipe(process.stderr);

      return async () => {
        try {
          if (childProcess.pid && !childProcess.killed) {
            process.kill(childProcess.pid, 'SIGINT');
          }
        } catch (error) {
          // Ignore for now
        }
      };
    };
  }

  return {
    ...options,
    entry: ['src/main.ts'],
    format: ['cjs', 'esm'],
    dts: process.env.GENERATE_DTS === 'true',
    sourcemap: true,
    clean: false, // MUST be false, otherwise the assets do not work
    shims: true,
    watch,
    onSuccess,
    publicDir: 'assets',
  };
});
