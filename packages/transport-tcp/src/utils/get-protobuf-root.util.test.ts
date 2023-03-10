import { expect } from 'chai';
import { getProtobufRoot } from './get-protobuf-root.util';

describe('getProtobufRoot', function () {
  it('should return protobuf root', function () {
    const root = getProtobufRoot();

    expect(root).to.be.an('object');
  });
});
