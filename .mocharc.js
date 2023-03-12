const path = require('path');

module.exports = {
  reporter: 'spec',
  recursive: true,
  require: [
    'ts-node/register/transpile-only',
    'source-map-support/register',
    path.resolve(__dirname, 'scripts/mocha.setup.js'),
  ],
  extension: ['js', 'ts'],
};
