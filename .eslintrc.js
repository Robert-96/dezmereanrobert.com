module.exports = {
  env: {
    browser: true
  },
  ignorePatterns: ['**/themes/loaf/layouts/**/*.json'],
  overrides: [
    {
      files: ['*.json'],
      extends: {
        plugin: 'jsonc/recommended-with-json'
      },
      parser: 'jsonc-eslint-parser',
      parserOptions: {
        jsonSyntax: 'JSON'
      }
    }
  ]
}
