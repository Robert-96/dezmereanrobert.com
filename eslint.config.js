module.exports = [
  {
    ignores: [
      '**/node_modules/.*',
      '**/themes/loaf/layouts/**/*.json'
    ]
  },
  {
    files: ['**/*.{js,cjs,mjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    }
  }
];
