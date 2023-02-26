import { PassThrough } from 'stream';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import mockFS from 'mock-fs';
import { encode } from '../../../src/commands/encode.command';
import { readStream } from '../../helpers/read-stream.helper';
import type { Duplex } from 'stream';

declare module 'mocha' {
  interface Context {
    json: string;
    stdio: {
      stdin: Duplex;
      stdout: Duplex;
      stderr: Duplex;
    };
  }
}

describe('encode', () => {
  beforeEach(function () {
    this.json = JSON.stringify([
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

    this.stdio = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
    };

    mockFS({
      'example.json': this.json,
    });
  });

  afterEach(function () {
    mockFS.restore();
  });

  it('encodes a tcp flow from stdin', async function () {
    encode('-', { ...this.stdio });

    this.stdio.stdin.write(this.json);
    this.stdio.stdin.end();

    const data = await readStream(this.stdio.stdout, 'hex');

    expect(data).to.be.equal('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c');
  });

  it('encodes a tcp flow from file', async function () {
    encode('example.json', { ...this.stdio });

    const data = await readStream(this.stdio.stdout, 'hex');

    expect(data).to.be.equal('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c');
  });
});
