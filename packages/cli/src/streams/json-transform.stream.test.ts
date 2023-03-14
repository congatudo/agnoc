import { expect } from 'chai';
import { readStream } from '../test-support';
import { JSONTransform } from './json-transform.stream';

describe('JSONTransform', function () {
  it('should convert an stream of strings to an object stream', async function () {
    const stream = new JSONTransform();

    stream.write('{');
    stream.write('"foo": "bar"');
    stream.end('}');

    const [object] = await readStream(stream);

    expect(object).to.be.deep.equal({ foo: 'bar' });
  });

  it('should throw an error when the json is malformed', async function () {
    const stream = new JSONTransform();

    stream.end('"foo": "bar"');

    await expect(readStream(stream)).to.be.rejectedWith(Error, 'Unexpected token');
  });
});
