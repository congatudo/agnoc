module.exports = {
  extends: '@istanbuljs/nyc-config-typescript',
  all: true,
  include: ['src'],
  reporter: ['html-spa', 'lcov', 'json', 'json-summary', 'text-summary'],
  'report-dir': 'coverage',
};
