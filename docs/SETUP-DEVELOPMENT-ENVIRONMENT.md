# MoaiTime - Setup Development Environment

## Prerequisites

- [VSCode](https://code.visualstudio.com) for your IDE
  - Once you have VSCode installed, go to the Extensions tab on the left-hand side and type in `@recommended` in the search bar. Then install all the recommended extensions.
- [NodeJS](https://nodejs.org) (v18+) for the backend
  - Preferably rather install [NVM](https://github.com/nvm-sh/nvm), so you can easily switch between node versions
- [Docker](https://docs.docker.com/get-docker/) for the containerization

## Steps

Follow these steps to set up your development environment:

1. **Check pnpm Installation**
   - Run `pnpm --version` in the terminal to check if pnpm is installed
2. **Enable Corepack for pnpm (if necessary)**
   - If pnpm is not installed, execute `corepack enable`
   - Run `pnpm --version` again to verify installation
   - For detailed instructions, visit the [pnpm Installation Guide](https://pnpm.io/installation)
3. **Install Dependencies**
   - Once pnpm is confirmed to be installed, use `pnpm install` to install all project dependencies
4. **Prepare Docker Environment**
   - Duplicate the `.env.local.example` file and rename it to `.env.local`. For now, you are not required to do any changes to it
   - You will need to duplicate the `.env.test.local.example` file and rename it to `.env.test.local`. The reason for this is, that when we running any kind of tests (unit or E2E), we want to use a different database, so we don't mess up the data in the main database
   - Start the Docker environment using `docker compose --file docker/compose.yaml up -d`
5. **Setup Database**
   - Run `pnpm cli database:reload` to setup the database. This drops the current schema in the database, runs the migrations and the inserts the seed and fixture data
6. **That is It**
   - If you are a developer, you will now want to run the following command: `pnpm dev`. This will start the backend and frontend in watch mode, so any changes you make to the code will be automatically picked up and the app will be reloaded. You can now go to <http://localhost:4200> and see the app running.
   - If you are a tester, then you will need to run: `pnpm e2e:watch`. This will open the Cypress Studio app, which you then use to write your tests. Once you are done writing then, you can close the original app and then run `pnpm e2e`. This will run all of the tests again, but in headless mode.
