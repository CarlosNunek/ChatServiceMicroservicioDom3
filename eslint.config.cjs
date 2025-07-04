const js = require('@eslint/js');

module.exports = [
  {
    ignores: [
      'controllers/**',
      'services/**',
      'events/**',
      'tests/**',
      'server.js'
    ],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: true,
        process: true,
        jest: true,
        describe: true,
        test: true,
        expect: true,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'no-empty': 'warn',
    },
  },
];

