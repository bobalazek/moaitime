# MyZenBuddy - Known Issues

## Zod dependency across multiple packages

Seems that there is an issue at the moment with `pnpm` where if you have zod as a dependency in multiple packages, it will fail to build. Seems to be related to the following issue: <https://github.com/microsoft/TypeScript/issues/47663>. As a temporary solution I removed `zod` from all packages and put it in the root `package.json` as a dependency, which seems to be working for now.

## Declaration types not working

Look at the following issue: <https://github.com/egoist/tsup/issues/885> and <https://tsup.egoist.dev/#generate-typescript-declaration-maps--d-ts-map>

## React not defined

You must not set the `emitDecoratorMetadata` to `true` in the `tsconfig.json` file. This will cause the `react` module to not be defined. See the following issue: <https://github.com/egoist/tsup/issues/792>
