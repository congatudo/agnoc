import { expect } from 'chai';
import { JSONStringifyTransform } from './json-stringify-transform.stream';

describe('JSONStringifystream', function () {
  it('should convert an stream of objects to a JSON-like string stream', function () {
    const stream = new JSONStringifyTransform();

    stream.write({ key1: 'value1' });
    stream.end({ key2: 'value2' });

    const object1 = stream.read() as string;
    const object2 = stream.read() as string;

    expect(object1).to.be.equal(`{
  "key1": "value1"
}`);
    expect(object2).to.be.equal(`{
  "key2": "value2"
}`);
  });

  it('should filter our buffer values', function () {
    const stream = new JSONStringifyTransform();

    stream.end({ foo: Buffer.from([1, 2, 3]) });

    const object = stream.read() as string;

    expect(object).to.be.equal(`{
  "foo": "[Buffer]"
}`);
  });
});
