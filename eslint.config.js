const { FlatCompat } = require('eslint/use-at-your-own-risk');

const compat = new FlatCompat();

module.exports = [
  ...compat.config({
    env: {
      es2021: true,
      node: true
    },
    extends: ['eslint:recommended'],
    parserOptions: {
      ecmaVersion: 12,
      sourceType: 'script'
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  })
];
