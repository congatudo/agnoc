module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  reporter: ['html-spa', 'lcov', 'json', 'json-summary', 'text-summary'],
  'report-dir': 'coverage',
  include: ['packages/*/src/**/*', 'src/**/*'],
  exclude: ['**/*.test.ts', '**/test-support/**/*', '**/test-support.ts'],
};
