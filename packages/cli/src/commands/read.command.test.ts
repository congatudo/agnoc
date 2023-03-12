import path from 'path';
import { PassThrough } from 'stream';
import { Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { readStream } from '../test-support';
import { ReadCommand } from './read.command';
import type { Stdio } from '../interfaces/stdio';
import type { PacketMapper } from '@agnoc/transport-tcp';

describe('ReadCommand', function () {
  let stdio: Stdio;
  let packetMapper: PacketMapper;
  let command: ReadCommand;

  beforeEach(function () {
    stdio = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
    };
    packetMapper = imock();
    command = new ReadCommand(stdio, instance(packetMapper));
  });

  it('should read a pcap file', async function () {
    const file = path.join(__dirname, '../../fixtures/dump.pcap');
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    await command.action(file, { json: false });

    const [ret1, ret2] = await readStream(stdio.stdout, 'utf8');

    expect(ret1).to.equal(
      '[fb3dd1ebc0e6c58f] [ctype: 2] [flow: 1] [userId: 4] [deviceId: 3] {"opcode":"DEVICE_GETTIME_RSP","object":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}\n',
    );
    expect(ret2).to.equal(
      '[fb3dd1ebc0e6c58f] [ctype: 2] [flow: 1] [userId: 4] [deviceId: 3] {"opcode":"DEVICE_GETTIME_RSP","object":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}\n',
    );

    verify(packetMapper.toDomain(anything())).twice();
  });

  it('should read a pcap file to json', async function () {
    const file = path.join(__dirname, '../../fixtures/dump.pcap');
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    await command.action(file, { json: true });

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
          object: { result: +0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
        },
      },
      {
        ctype: 2,
        flow: 1,
        deviceId: 3,
        userId: 4,
        sequence: 'fb3dd1ebc0e6c58f',
        payload: {
          opcode: 'DEVICE_GETTIME_RSP',
          object: { result: +0, body: { deviceTime: 1606129555, deviceTimezone: 3600 } },
        },
      },
    ]);

    verify(packetMapper.toDomain(anything())).twice();
  });

  it('should write to stderr when an error is thrown', async function () {
    const file = path.join(__dirname, '../../fixtures/dump.pcap');

    when(packetMapper.toDomain(anything())).thenThrow(new Error('some error'));

    await command.action(file, { json: false });

    const [ret] = await readStream(stdio.stderr, 'utf8');

    expect(ret).to.include('Error: some error\n');

    verify(packetMapper.toDomain(anything())).once();
  });
});
