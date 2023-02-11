import { Transform } from 'stream';
import { Packet, OPDecoderLiteral } from '@agnoc/core';
import { isObject } from '@agnoc/toolkit';
import { ArrayTransform } from '../streams/array-transform.stream';

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === 'Buffer') {
    return '[Buffer]';
  }

  return value;
}

export function toJSONStream(): Transform[] {
  return [
    new ArrayTransform(),
    new Transform({
      objectMode: true,
      transform(array: Packet<OPDecoderLiteral>[], _, done) {
        const list = array.map((packet) => packet.toJSON());

        this.push(JSON.stringify(list, filterProperties, 2));
        done();
      },
    }),
  ];
}
