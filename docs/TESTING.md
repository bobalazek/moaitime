# MoaiTime - Testing

Once you have the project setup, you can run the E2E the main command you need to know is `pnpm e2e:watch`. This will open the Cypress Studio app, which you then use to write your tests. Once you are done writing then, you can close the original app and then run `pnpm e2e`. This will run all of the tests again, but in headless mode.

## FAQ

### How do I test if emails are being sent?

See an example in the [../apps/web-e2e/src/e2e/features/auth/auth-register.cy.ts](../apps/web-e2e/src/e2e/features/auth/auth-register.cy.ts) test file.

### What is the difference between `seeds` and `fixtures`?

In the codebase you'll see a few instances of that and you may think why we use both of the terms. The difference is that the `seeds` are used to populate the database with data that is required for the application to run. Those seeds will also be run on the initial production deployment. The `fixtures` are used to populate the database with data that is only used for testing purposes and will never end up in any live environments, except your local one and the CI environments.
