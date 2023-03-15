import { expect } from 'chai';
import { BufferWriter } from './buffer-writer.stream';

describe('buffer-writer.stream', function () {
  it('creates an empty writable stream', function () {
    const stream = new BufferWriter();

    expect(stream.buffer).to.be.empty;

    stream.write(Buffer.from('hello', 'utf8'));

    expect(stream.buffer.toString('utf8')).to.be.equal('hello');
  });

  it('creates a writable stream from a buffer', function () {
    const stream = new BufferWriter(Buffer.from('hello', 'utf8'));

    expect(stream.buffer.toString('utf8')).to.be.equal('hello');

    stream.write(Buffer.from('world', 'utf8'));

    expect(stream.buffer.toString('utf8')).to.be.equal('helloworld');
  });
});
