/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    node: true,
  },
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'plugin:import/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
};
