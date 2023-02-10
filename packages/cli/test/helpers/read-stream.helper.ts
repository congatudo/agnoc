import { Readable } from 'stream';

export function readStream(stream: Readable, encoding: BufferEncoding = 'utf8'): Promise<string> {
  stream.setEncoding(encoding);

  return new Promise((resolve, reject) => {
    let data = '';

    stream.on('data', (chunk) => (data += chunk));
    stream.on('end', () => resolve(data));
    stream.on('error', (error) => reject(error));
  });
}
