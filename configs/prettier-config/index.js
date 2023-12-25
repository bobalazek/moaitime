/** @type {import("prettier").Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
  plugins: [
    '@ianvs/prettier-plugin-sort-imports',
    'prettier-plugin-packagejson',
    'prettier-plugin-tailwindcss', // Make sure that this one is always last!
  ],
  importOrder: [
    '<TYPES>',
    '',
    '<TYPES>^[.]',
    '',
    '<BUILT_IN_MODULES>',
    '',
    '<THIRD_PARTY_MODULES>',
    '',
    '^@moaitime/(.*)$',
    '',
    '^[./]',
  ],
  importOrderParserPlugins: ['typescript', 'classProperties', 'decorators-legacy', 'jsx'],
  tailwindFunctions: ['tw', 'cn', 'clsx', 'cva'],
};

module.exports = config;
