import { Duplex, pipeline } from 'stream';
import { PacketDecodeTransform } from '../streams/packet-decode-transform.stream';
import { TCPReader } from '../streams/tcp-reader.stream';
import { toJSONStream } from '../utils/to-json-stream.util';
import { toStringStream } from '../utils/to-string-stream.util';

interface ReadOptions {
  json: true | undefined;
  stdin: Duplex;
  stdout: Duplex;
  stderr: Duplex;
}

export async function read(file: string, options: ReadOptions): Promise<void> {
  let pcap;

  try {
    pcap = await import('pcap');
  } catch (e) {
    throw new ReferenceError(`Unable to find 'pcap' module. Try installing 'lib-pcap' and reinstalling this package.`);
  }

  pipeline(
    new TCPReader(file, {
      filter: 'port 4010 or port 4030 or port 4050',
      decode: pcap.decode,
      createSession: pcap.createOfflineSession,
    }),
    new PacketDecodeTransform(),
    ...(options.json ? toJSONStream() : toStringStream()),
    options.stdout,
    (err) => {
      if (err && err.stack) {
        options.stderr.write(err.stack);
      }
    },
  );
}
