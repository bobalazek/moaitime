/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@myzenbuddy/eslint-config'],
  ignorePatterns: ['**/dist/**/*', '**/node_modules/**/*'],
};
