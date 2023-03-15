import { expect } from 'chai';
import { hasKey } from './has-key.util';

describe('hasKey', function () {
  it('should return true if the key exists', function () {
    const obj = { key: 'value' };

    expect(hasKey(obj, 'key')).to.be.true;
  });

  it('should return false if the key does not exist', function () {
    const obj = { key: 'value' };

    expect(hasKey(obj, 'otherKey')).to.be.false;
  });
});
