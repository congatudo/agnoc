module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  reporter: ['html', 'lcov', 'json', 'json-summary', 'text-summary'],
  'report-dir': 'coverage',
  exclude: ['**/*.test.ts', '**/coverage/**', '**/lib/**', '**/types/**'],
};
