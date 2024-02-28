/* eslint-disable @typescript-eslint/no-var-requires */

const nodeExternals = require('webpack-node-externals');
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const WatchExternalFilesPlugin = require('webpack-watch-external-files-plugin');
const { readdirSync } = require('fs');
const { join } = require('path');

// Packages and aliases
const packagePaths = [];
const packageResolvedAliases = {};
const packages = readdirSync(join(__dirname, '../../packages'));
for (const packageName of packages) {
  // TODO: we can only watch the packages that have @moaitime/api as dependency

  if (packageName.startsWith('web-')) {
    continue;
  }

  const packagePath = join(__dirname, `../../packages/${packageName}/src/`);

  packagePaths.push(`${packagePath}**/*.ts`);
  packageResolvedAliases[`@moaitime/${packageName}`] = packagePath;
}

module.exports = function (options, webpack) {
  return {
    ...options,
    // CUSTOM - the provided module.rules ts-loader is not really workig as it should
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    entry: ['webpack/hot/poll?500', options.entry],
    externals: [
      nodeExternals({
        allowlist: ['webpack/hot/poll?500'],
      }),
    ],
    plugins: [
      ...options.plugins,
      new webpack.HotModuleReplacementPlugin(),
      new webpack.WatchIgnorePlugin({
        paths: [/\.js$/, /\.d\.ts$/],
      }),
      new WatchExternalFilesPlugin({
        files: packagePaths,
      }),
      new RunScriptWebpackPlugin({
        name: options.output.filename,
        signal: 'SIGTERM',
      }),
    ],
    resolve: {
      ...options.resolve,
      alias: {
        ...options.resolve.alias,
        ...packageResolvedAliases,
      },
    },
  };
};
