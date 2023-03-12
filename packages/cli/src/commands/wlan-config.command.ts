import { Socket } from 'net';
import { BufferWriter, writeWord, debug } from '@agnoc/toolkit';
import type { Command } from '../interfaces/command';

export interface WlanConfigCommandOptions {
  timeout: number;
}

export class WlanConfigCommand implements Command {
  constructor(private readonly host: string, private readonly port: number) {}

  action(ssid: string, pass: string, { timeout }: WlanConfigCommandOptions): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const debugInstance = debug('wlan:config');
      const socket = new Socket();

      socket.on('data', (data) => {
        debugInstance(`Received data: ${data.toString('hex')}`);
        socket.end();
        resolve();
      });

      socket.on('connect', () => {
        debugInstance('Sending wifi headers...');
        socket.write(buildHeaders());
        debugInstance('Sending wifi payload...');
        socket.write(buildPayload(ssid, pass));
      });

      socket.on('error', (e) => {
        reject(e);
      });

      /* istanbul ignore next - hard to test */
      socket.on('timeout', () => {
        socket.destroy(new Error('Timeout connecting to robot.'));
      });

      socket.setTimeout(timeout);
      socket.connect({
        host: this.host,
        port: this.port,
        family: 4,
      });

      debugInstance(`Connecting to robot at ${this.host}`);
    });
  }
}

function buildHeaders() {
  const stream = new BufferWriter();

  writeWord(stream, 0x51589158);
  writeWord(stream, 0);
  writeWord(stream, 0x65);
  writeWord(stream, 0x54);
  writeWord(stream, 0);

  return stream.buffer;
}

function str(str: string, size: number) {
  const buffer = Buffer.alloc(size);

  buffer.write(str);

  return buffer;
}

function buildPayload(ssid: string, pass: string) {
  const stream = new BufferWriter();

  stream.write(str(ssid, 32));
  stream.write(str(pass, 48));

  writeWord(stream, 290826);

  return stream.buffer;
}
