import { Socket } from 'net';
import { BufferWriter, writeWord, debug } from '@agnoc/toolkit';

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

interface WlanConfigOptions {
  timeout: number;
}

export function wlanConfig(ssid: string, pass: string, { timeout }: WlanConfigOptions): Promise<void> {
  return new Promise((resolve, reject) => {
    const debugInstance = debug('wlan:config');
    const socket = new Socket();
    const gateway = '192.168.5.1';
    const port = 6008;

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

    socket.on('timeout', () => {
      socket.destroy(new Error('Timeout connecting to robot.'));
    });

    socket.setTimeout(timeout);
    socket.connect({
      host: gateway,
      port,
      family: 4,
    });

    debugInstance(`Connecting to robot at ${gateway}`);
  });
}
