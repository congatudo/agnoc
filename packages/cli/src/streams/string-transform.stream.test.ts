import { readStream } from '@agnoc/test-support';
import { expect } from 'chai';
import { StringTransform } from './string-transform.stream';

describe('StringTransform', function () {
  it('should convert an stream of objects to an string stream', async function () {
    const stream = new StringTransform();

    stream.end({
      toString() {
        return 'foo';
      },
    });

    const [object] = await readStream(stream);

    expect(object).to.be.equal('foo\n');
  });
});
