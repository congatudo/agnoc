import { once, Stream } from 'stream';
import { expect } from 'chai';
import { toStream } from './to-stream.util';

describe('toStream', function () {
  it('should return a stream', async function () {
    const stream = toStream(Buffer.from('foo'));
    const data = await once(stream, 'data');

    expect(stream).to.be.instanceof(Stream);
    expect(data.toString()).to.be.equal('foo');
  });
});
