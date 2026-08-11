import { Transform } from 'stream';
import { OPDecoderLiteral } from '@congatudo/core/constants/opcodes.constant';
import { isObject } from '@congatudo/core/utils/is-object.util';
import { Packet } from '@congatudo/core/value-objects/packet.value-object';
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
