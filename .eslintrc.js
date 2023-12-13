/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@moaitime/eslint-config'],
  ignorePatterns: ['**/dist/**/*', '**/node_modules/**/*'],
  overrides: [
    {
      // To much false positives. See: https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-cycle.md#when-not-to-use-it
      files: ['**/*.{ts,tsx}'],
      rules: {
        'import/no-unresolved': 'off',
      },
    },
  ],
};
