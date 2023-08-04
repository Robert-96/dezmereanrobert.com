module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true
  },
  ignorePatterns: [
    '!.*',
    '**/node_modules/.*',
    '**/themes/loaf/layouts/**/*.json'
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: module
  },
  overrides: [
    {
      files: ['*.json'],
      extends: 'plugin:jsonc/recommended-with-json',
      parser: 'jsonc-eslint-parser',
      parserOptions: {
        jsonSyntax: 'JSON'
      }
    }
  ]
}
