import { readStream } from '@agnoc/test-support';
import { expect } from 'chai';
import { JSONStringifyTransform } from './json-stringify-transform.stream';

describe('JSONStringifystream', function () {
  it('should convert an stream of objects to a JSON-like string stream', async function () {
    const stream = new JSONStringifyTransform();

    stream.write({ key1: 'value1' });
    stream.end({ key2: 'value2' });

    const [object1, object2] = await readStream(stream);

    expect(object1).to.be.equal(`{
  "key1": "value1"
}`);
    expect(object2).to.be.equal(`{
  "key2": "value2"
}`);
  });

  it('should filter our buffer values', async function () {
    const stream = new JSONStringifyTransform();

    stream.end({ foo: Buffer.from([1, 2, 3]) });

    const [object] = await readStream(stream);

    expect(object).to.be.equal(`{
  "foo": "[Buffer]"
}`);
  });
});
