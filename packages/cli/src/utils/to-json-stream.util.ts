import { OPDecoderLiteral } from "@agnoc/core/constants/opcodes.constant";
import { isObject } from "@agnoc/core/utils/is-object.util";
import { Packet } from "@agnoc/core/value-objects/packet.value-object";
import { Transform } from "stream";
import { ArrayTransform } from "../streams/array-transform.stream";

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === "Buffer") {
    return "[Buffer]";
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
