# MoaiTime - Commands

## General

- `pnpm dev` - starts all the apps (web and API) for development on <http://localhost:4200> and <http://localhost:3636>
- `pnpm dev:e2e` - runs the E2E tests with Cypress Studio, while also starting the API and web apps
- `pnpm dev:emails` - runs the emails server on <http://localhost:3535>
- `pnpm build` - builds all the apps and libraries
- `pnpm test` - runs all the unit tests with Vitest
- `pnpm test:watch` - runs all the unit tests with Vitest in watch mode
- `pnpm e2e` - runs the E2E tests with Cypress, while also starting the API and web apps
- `pnpm lint` - runs ESLint
- `pnpm format` - runs and fixes issues with the Prettier
- `pnpm format:check` - checks if there are any issues with the Prettier
- `pnpm clean` - removes the `node_modules`, `dist` and `.turbo` folders in the root and all of it's apps and packages

## CLI

### CLI - Database

- `pnpm cli database:reload` - it will run the following commands specified below in that order (drop schemas, run migrations, insert seed data and insert fixture data)
- `pnpm cli database:migrations:generate` - generates a new migration file
- `pnpm cli database:migrations:run` - runs all the migrations
- `pnpm cli database:schema:drop` - drops the database schema
- `pnpm cli database:seeds:insert` - inserts the seed data
- `pnpm cli database:seeds:public-calendars:update` - updates the seed data for the public calendars
- `pnpm cli database:fixtures:insert` - inserts the fixture data
- `pnpm cli database:backup [fileName]` - backs up the database
- `pnpm cli database:recover <fileName> [-c, --confirm]` - recovers the database

### CLI - Jobs Runner

- `pnpm cli jobs:runner:start` - starts all the jobs

### CLI - Health

- `pnpm cli health:check` - checks the health of the app
