import { debug } from './debug.util';

describe('debug.util', function () {
  it('should log a message', function () {
    const instance = debug('namespace');

    instance('message');
  });
});
