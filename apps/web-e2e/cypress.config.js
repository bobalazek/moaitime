// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require('cypress');

const env = {
  users: {
    default: {
      email: 'tester@corcosoft.com',
      password: 'password',
    },
  },
};

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:4200',
    supportFile: 'src/support/index.ts',
    fixturesFolder: 'src/fixtures',
    specPattern: 'src/e2e',
  },
  viewportHeight: 1080,
  viewportWidth: 1920,
  env,
});
