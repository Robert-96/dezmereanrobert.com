module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '!.*',
    '**/node_modules/.*',
    '**/themes/loaf/layouts/**/*.json'
  ],
  parserOptions: {
    ecmaVersion: '2020',
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
