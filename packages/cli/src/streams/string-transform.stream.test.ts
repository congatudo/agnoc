import { expect } from 'chai';
import { StringTransform } from './string-transform.stream';

describe('StringTransform', function () {
  it('should convert an stream of objects to an string stream', function () {
    const stream = new StringTransform();

    stream.end({
      toString() {
        return 'foo';
      },
    });

    const object = stream.read() as string;

    expect(object).to.be.equal('foo\n');
  });
});
