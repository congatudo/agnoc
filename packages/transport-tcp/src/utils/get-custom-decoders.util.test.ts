import { expect } from 'chai';
import { getCustomDecoders } from './get-custom-decoders.util';

describe('getCustomDecoders', function () {
  it('should return custom decoders', function () {
    const decoders = getCustomDecoders();

    expect(decoders).to.be.an('object');
  });
});
