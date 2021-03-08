import { createReadStream } from "fs";
import { Duplex, pipeline, Transform } from "stream";
import { Packet } from "@agnoc/core/entities/packet.entity";
import { ArrayTransform } from "@agnoc/core/streams/array-transform.stream";
import { PacketDecodeTransform } from "@agnoc/core/streams/packet-decode-transform.stream";
import { isObject } from "@agnoc/core/utils/is-object.util";

interface DecodeOptions {
  json: true | undefined;
  stdin: Duplex;
  stdout: Duplex;
  stderr: Duplex;
}

function filterProperties(_: string, value: unknown) {
  if (isObject(value) && value.type === "Buffer") {
    return "[Buffer]";
  }

  return value;
}

function toJSONStream() {
  return [
    new ArrayTransform(),
    new Transform({
      objectMode: true,
      transform(array: Packet[], _, done) {
        const list = array.map((packet) => packet.toJSON());

        this.push(JSON.stringify(list, filterProperties, 2));
        done();
      },
    }),
  ];
}

function toStringStream() {
  return [
    new Transform({
      objectMode: true,
      transform(packet: Packet, _, done) {
        this.push(packet.toString() + "\n");
        done();
      },
    }),
  ];
}

export function decode(file: string, options: DecodeOptions): void {
  pipeline(
    file === "-" ? options.stdin : createReadStream(file),
    new PacketDecodeTransform(),
    ...(options.json ? toJSONStream() : toStringStream()),
    options.stdout,
    (err) => {
      if (err && err.stack) {
        options.stderr.write(err.stack);
      }
    }
  );
}
