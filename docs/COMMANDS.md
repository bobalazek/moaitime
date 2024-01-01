# MoaiTime - Commands

## General

- `pnpm dev` - starts all the apps (web and API) for development on <http://localhost:4200> and <http://localhost:3636>
- `pnpm build` - builds all the apps and libraries
- `pnpm test` - runs all the unit tests with Vitest
- `pnpm test:watch` - runs all the unit tests with Vitest in watch mode
- `pnpm e2e` - runs the E2E tests with Cypress, while also starting the API and web apps
- `pnpm dev:e2e` - runs the E2E tests with Cypress Studio, while also starting the API and web apps
- `pnpm lint` - runs the ESLint
- `pnpm format` - runs and fixes issues with the Prettier
- `pnpm format:check` - checks if there are any issues with the Prettier
- `pnpm clean` - removes the `node_modules`, `dist` and `.turbo` folders in the root and all of it's apps and packages

## Database

- `pnpm database:check` - checks if the database is running
- `pnpm database:generate-migration` - generates a new migration file
- `pnpm database:update-metadata` - runs all the migrations

## CLI

### CLI - Database

- `pnpm cli database:reload` - it will run the following commands specified below in that order (drop-schemas, run-migrations, insert-seed-data and insert-fixture-data)
- `pnpm cli database:drop-schema` - drops the database schema
- `pnpm cli database:run-migrations` - runs all the migrations
- `pnpm cli database:insert-seed-data` - inserts the seed data
- `pnpm cli database:insert-fixture-data` - inserts the fixture data

### CLI - Jobs Runner

- `pnpm cli jobs:runner:start` - starts all the jobs
