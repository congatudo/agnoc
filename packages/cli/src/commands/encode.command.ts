/* eslint-disable security/detect-non-literal-fs-filename */
import { createReadStream } from 'fs';
import { pipeline } from 'stream';
import { JSONTransform } from '../streams/json-transform.stream';
import { PacketEncodeTransform } from '../streams/packet-encode-transform.stream';
import type { Command } from '../interfaces/command';
import type { Stdio } from '../interfaces/stdio';
import type { PacketMapper, PayloadFactory } from '@agnoc/transport-tcp';

export class EncodeCommand implements Command {
  constructor(
    private readonly stdio: Stdio,
    private readonly packetMapper: PacketMapper,
    private readonly payloadFactory: PayloadFactory,
  ) {}

  action(file: string): void {
    pipeline(
      file === '-' ? this.stdio.stdin : createReadStream(file),
      new JSONTransform(),
      new PacketEncodeTransform(this.packetMapper, this.payloadFactory),
      this.stdio.stdout,
      (err) => {
        if (err instanceof Error) {
          this.stdio.stderr.end(err.stack);
        }
      },
    );
  }
}
