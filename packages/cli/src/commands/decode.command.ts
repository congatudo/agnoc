/* eslint-disable security/detect-non-literal-fs-filename */
import { createReadStream } from 'fs';
import { pipeline } from 'stream';
import { PacketDecodeTransform } from '../streams/packet-decode-transform.stream';
import { toJSONStream } from '../utils/to-json-stream.util';
import { toStringStream } from '../utils/to-string-stream.util';
import type { PacketMapper } from '@agnoc/transport-tcp';
import type { Duplex } from 'stream';

interface DecodeOptions {
  json: true | undefined;
  stdin: Duplex;
  stdout: Duplex;
  stderr: Duplex;
  packetMapper: PacketMapper;
}

export function decode(file: string, options: DecodeOptions): void {
  pipeline(
    file === '-' ? options.stdin : createReadStream(file),
    new PacketDecodeTransform(options.packetMapper),
    ...(options.json ? toJSONStream() : toStringStream()),
    options.stdout,
    (err) => {
      if (err && err.stack) {
        options.stderr.write(err.stack);
      }
    },
  );
}
