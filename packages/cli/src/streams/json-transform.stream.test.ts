import { expect } from 'chai';
import { JSONTransform } from './json-transform.stream';

describe('JSONTransform', function () {
  it('should convert an stream of strings to an object stream', function () {
    const stream = new JSONTransform();

    stream.write('{');
    stream.write('"foo": "bar"');
    stream.end('}');

    const object = stream.read() as object;

    expect(object).to.be.deep.equal({ foo: 'bar' });
  });
});
