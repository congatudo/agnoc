/* eslint-disable security/detect-non-literal-fs-filename */
import { createReadStream } from 'fs';
import { pipeline } from 'stream';
import { ArrayTransform } from '../streams/array-transform.stream';
import { JSONStringifyTransform } from '../streams/json-stringify-transform.stream';
import { PacketDecodeTransform } from '../streams/packet-decode-transform.stream';
import { StringTransform } from '../streams/string-transform.stream';
import type { Command } from '../interfaces/command';
import type { Stdio } from '../interfaces/stdio';
import type { PacketMapper } from '@agnoc/transport-tcp';

export interface DecodeCommandOptions {
  json: boolean;
}

export class DecodeCommand implements Command {
  constructor(private readonly stdio: Stdio, private readonly packetMapper: PacketMapper) {}

  action(file: string, options: DecodeCommandOptions): void {
    pipeline(
      file === '-' ? this.stdio.stdin : createReadStream(file),
      new PacketDecodeTransform(this.packetMapper),
      ...(options.json ? [new ArrayTransform(), new JSONStringifyTransform()] : [new StringTransform()]),
      this.stdio.stdout,
      (err) => {
        if (err instanceof Error) {
          this.stdio.stderr.end(err.stack);
        }
      },
    );
  }
}
