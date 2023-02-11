/* eslint-disable security/detect-non-literal-fs-filename */
import { createReadStream } from 'fs';
import { Duplex, pipeline } from 'stream';
import { JSONTransform } from '../streams/json-transform.stream';
import { PacketEncodeTransform } from '../streams/packet-encode-transform.stream';

interface EncodeOptions {
  stdin: Duplex;
  stdout: Duplex;
  stderr: Duplex;
}

export function encode(file: string, options: EncodeOptions): void {
  pipeline(
    file === '-' ? options.stdin : createReadStream(file),
    new JSONTransform(),
    new PacketEncodeTransform(),
    options.stdout,
    (err) => {
      if (err && err.stack) {
        options.stderr.write(err.stack);
      }
    },
  );
}
