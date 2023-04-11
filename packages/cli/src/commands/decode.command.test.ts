import { PassThrough } from 'stream';
import { readStream } from '@agnoc/test-support';
import { Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { imock, when, anything, verify, instance, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import mockFS, { restore } from 'mock-fs';
import { DecodeCommand } from './decode.command';
import type { Stdio } from '../interfaces/stdio';
import type { PacketMapper } from '@agnoc/transport-tcp';

describe('DecodeCommand', function () {
  let stdio: Stdio;
  let packetMapper: PacketMapper;
  let command: DecodeCommand;
  let buffer: Buffer;
  let filename: string;

  beforeEach(function () {
    buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');
    stdio = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
    };
    packetMapper = imock();
    command = new DecodeCommand(stdio, instance(packetMapper));
    filename = 'example.bin';
    mockFS({
      [filename]: buffer,
    });
  });

  afterEach(function () {
    restore();
  });

  it('should decode buffer to packet from stdin', async function () {
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    command.action('-', { json: false });

    stdio.stdin.end(buffer);

    const [ret] = await readStream(stdio.stdout, 'utf8');

    expect(ret).to.equal(
      '[fb3dd1ebc0e6c58f] [ctype: 2] [flow: 1] [userId: 4] [deviceId: 3] {"opcode":"DEVICE_GETTIME_RSP","data":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}\n',
    );

    verify(packetMapper.toDomain(deepEqual(buffer))).once();
  });

  it('should decode buffer to packet from stdin to json', async function () {
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    command.action('-', { json: true });

    stdio.stdin.end(buffer);

    const [ret] = await readStream(stdio.stdout, 'utf8');

    expect(JSON.parse(ret)).to.be.deep.equal([
      {
        ctype: 2,
        flow: 1,
        deviceId: 3,
        userId: 4,
        sequence: 'fb3dd1ebc0e6c58f',
        payload: {
          opcode: 'DEVICE_GETTIME_RSP',
          data: { result: +0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
        },
      },
    ]);

    verify(packetMapper.toDomain(anything())).once();
  });

  it('should decode buffer to packet from file', async function () {
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    command.action(filename, { json: false });

    const [ret] = await readStream(stdio.stdout, 'utf8');

    expect(ret).to.equal(
      '[fb3dd1ebc0e6c58f] [ctype: 2] [flow: 1] [userId: 4] [deviceId: 3] {"opcode":"DEVICE_GETTIME_RSP","data":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}\n',
    );

    verify(packetMapper.toDomain(deepEqual(buffer))).once();
  });

  it('should decode buffer to packet from file to json', async function () {
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    command.action(filename, { json: true });

    const [ret] = await readStream(stdio.stdout, 'utf8');

    expect(JSON.parse(ret)).to.be.deep.equal([
      {
        ctype: 2,
        flow: 1,
        deviceId: 3,
        userId: 4,
        sequence: 'fb3dd1ebc0e6c58f',
        payload: {
          opcode: 'DEVICE_GETTIME_RSP',
          data: { result: +0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
        },
      },
    ]);

    verify(packetMapper.toDomain(anything())).once();
  });

  it('should write to stderr when an error is thrown', async function () {
    when(packetMapper.toDomain(anything())).thenThrow(new Error('some error'));

    command.action('-', { json: false });

    stdio.stdin.end(buffer);

    const [ret] = await readStream(stdio.stderr, 'utf8');

    expect(ret).to.include('Error: some error\n');

    verify(packetMapper.toDomain(deepEqual(buffer))).once();
  });
});
