module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        require: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setImmediate: 'readonly',
        clearImmediate: 'readonly',
      queueMicrotask: 'readonly'
      }
    },
    plugins: {
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    }
  }
];
