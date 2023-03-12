import { pipeline } from 'stream';
import { ArrayTransform } from '../streams/array-transform.stream';
import { JSONStringifyTransform } from '../streams/json-stringify-transform.stream';
import { PacketDecodeTransform } from '../streams/packet-decode-transform.stream';
import { PCapReader } from '../streams/pcap-reader.stream';
import { PCapTransform } from '../streams/pcap-transform.stream';
import { StringTransform } from '../streams/string-transform.stream';
import type { Command } from '../interfaces/command';
import type { Stdio } from '../interfaces/stdio';
import type { PacketMapper } from '@agnoc/transport-tcp';

export interface ReadCommandOptions {
  json: boolean;
}

export class ReadCommand implements Command {
  constructor(private readonly stdio: Stdio, private readonly packetMapper: PacketMapper) {}

  async action(file: string, options: ReadCommandOptions): Promise<void> {
    let pcap;

    try {
      pcap = await import('pcap');
    } catch (e) {
      /* istanbul ignore next */
      throw new ReferenceError(`Unable to find 'pcap' module. Try installing 'lib-pcap' and reinstalling this package`);
    }

    pipeline(
      new PCapReader(file, {
        filter: 'port 4010 or port 4030 or port 4050',
        decode: pcap.decode,
        createSession: pcap.createOfflineSession,
      }),
      new PCapTransform(),
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
