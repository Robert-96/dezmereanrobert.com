module.exports = {
  env: {
    browser: true,
    es2016: true,
    jest: true,
  },
  ignorePatterns: [
    '!.*',
    '**/node_modules/.*',
    '**/themes/loaf/layouts/**/*.json'
  ],
  parserOptions: {
    sourceType: 'module'
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
