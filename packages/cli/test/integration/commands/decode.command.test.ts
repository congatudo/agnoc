import { PassThrough } from 'stream';
import {
  PacketMapper,
  PayloadFactory,
  PayloadObjectParserService,
  getProtobufRoot,
  getCustomDecoders,
} from '@agnoc/transport-tcp';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import mockFS, { restore } from 'mock-fs';
import { decode } from '../../../src/commands/decode.command';
import { readStream } from '../../helpers/read-stream.helper';
import type { Duplex } from 'stream';

declare module 'mocha' {
  interface Context {
    buffer: Buffer;
    stdio: {
      stdin: Duplex;
      stdout: Duplex;
      stderr: Duplex;
    };
  }
}

const payloadFactory = new PayloadFactory(new PayloadObjectParserService(getProtobufRoot(), getCustomDecoders()));
const packetMapper = new PacketMapper(payloadFactory);

describe('decode', () => {
  beforeEach(function () {
    this.buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');

    this.stdio = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
    };

    mockFS({
      'example.bin': this.buffer,
    });
  });

  afterEach(function () {
    restore();
  });

  it('decodes a tcp flow from stdin', async function () {
    decode('-', { ...this.stdio, json: undefined, packetMapper });

    this.stdio.stdin.write(this.buffer);
    this.stdio.stdin.end();

    const data = await readStream(this.stdio.stdout);

    expect(data).to.be.equal(
      '[7a479a0fbb978c12] [ctype: 2] [flow: 1] [userId: 2] [deviceId: 1] {"opcode":"DEVICE_GETTIME_RSP","object":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}\n',
    );
  });

  it('decodes a tcp flow from stdin to json', async function () {
    decode('-', { ...this.stdio, json: true, packetMapper });

    this.stdio.stdin.write(this.buffer);
    this.stdio.stdin.end();

    const data = await readStream(this.stdio.stdout);

    expect(JSON.parse(data)).to.be.deep.equal([
      {
        ctype: 2,
        flow: 1,
        deviceId: 1,
        userId: 2,
        sequence: '7a479a0fbb978c12',
        payload: {
          opcode: 'DEVICE_GETTIME_RSP',
          object: {
            result: 0,
            body: {
              deviceTime: 1606129555,
              deviceTimezone: 3600,
            },
          },
        },
      },
    ]);
  });

  it('decodes a tcp flow from file', async function () {
    decode('example.bin', { ...this.stdio, json: undefined, packetMapper });

    const data = await readStream(this.stdio.stdout);

    expect(data).to.be.equal(
      '[7a479a0fbb978c12] [ctype: 2] [flow: 1] [userId: 2] [deviceId: 1] {"opcode":"DEVICE_GETTIME_RSP","object":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}\n',
    );
  });

  it('decodes a tcp flow from file to json', async function () {
    decode('example.bin', { ...this.stdio, json: true, packetMapper });

    const data = await readStream(this.stdio.stdout);

    expect(JSON.parse(data)).to.be.deep.equal([
      {
        ctype: 2,
        flow: 1,
        deviceId: 1,
        userId: 2,
        sequence: '7a479a0fbb978c12',
        payload: {
          opcode: 'DEVICE_GETTIME_RSP',
          object: {
            result: 0,
            body: {
              deviceTime: 1606129555,
              deviceTimezone: 3600,
            },
          },
        },
      },
    ]);
  });
});
