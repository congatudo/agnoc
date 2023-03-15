import { Readable } from 'stream';
import { expect } from 'chai';
import { readStream } from './read-stream.util';

describe('readStream', function () {
  it('should read data from stream', async function () {
    const stream = new Readable();
    const reader = readStream(stream);

    stream.push('a');
    stream.push('b');
    stream.push(null);

    expect(await reader).to.deep.equal([Buffer.from('a'), Buffer.from('b')]);
  });

  it('should read data from stream with encoding', async function () {
    const stream = new Readable();
    const reader = readStream(stream, 'utf8');

    stream.push('a');
    stream.push('b');
    stream.push(null);

    expect(await reader).to.deep.equal(['a', 'b']);
  });

  it('should reject if stream emits error', async function () {
    const stream = new Readable();
    const reader = readStream(stream);

    stream.emit('error', new Error('test'));

    await expect(reader).to.be.rejectedWith('test');
  });

  it('should read object data from stream', async function () {
    const stream = new Readable({ objectMode: true });
    const reader = readStream(stream);

    stream.push({ a: 1 });
    stream.push({ b: 2 });
    stream.push(null);

    expect(await reader).to.deep.equal([{ a: 1 }, { b: 2 }]);
  });
});
