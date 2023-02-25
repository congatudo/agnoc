const path = require('path');

module.exports = {
  reporter: 'spec',
  recursive: true,
  require: [path.resolve(__dirname, 'scripts/babel-register.js'), path.resolve(__dirname, 'scripts/setup.js')],
  extension: ['js', 'ts'],
};
