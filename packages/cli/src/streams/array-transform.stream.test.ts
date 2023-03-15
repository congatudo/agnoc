import { readStream } from '@agnoc/test-support';
import { expect } from 'chai';
import { ArrayTransform } from './array-transform.stream';

describe('ArrayTransform', function () {
  it('should convert an stream of objects to an array stream', async function () {
    const stream = new ArrayTransform();

    stream.write({ key1: 'value1' });
    stream.end({ key2: 'value2' });

    const [array] = await readStream(stream);

    expect(array).to.be.deep.equal([{ key1: 'value1' }, { key2: 'value2' }]);
  });
});
