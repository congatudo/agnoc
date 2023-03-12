import { PassThrough } from 'stream';
import { ID } from '@agnoc/toolkit';
import { OPCode, Packet, PacketSequence, Payload } from '@agnoc/transport-tcp';
import { givenSomePayloadProps } from '@agnoc/transport-tcp/test-support';
import { imock, when, anything, verify, instance, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import mockFS, { restore } from 'mock-fs';
import { givenAJSONPacket, readStream } from '../test-support';
import { EncodeCommand } from './encode.command';
import type { Stdio } from '../interfaces/stdio';
import type { JSONPacket } from '../streams/packet-encode-transform.stream';
import type { PacketMapper, PayloadFactory } from '@agnoc/transport-tcp';

describe('EncodeCommand', function () {
  let stdio: Stdio;
  let packetMapper: PacketMapper;
  let payloadFactory: PayloadFactory;
  let command: EncodeCommand;
  let filename: string;
  let jsonPacket: JSONPacket;

  beforeEach(function () {
    jsonPacket = givenAJSONPacket();
    stdio = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
    };
    packetMapper = imock();
    payloadFactory = imock();
    command = new EncodeCommand(stdio, instance(packetMapper), instance(payloadFactory));
    filename = 'example.bin';
    mockFS({
      [filename]: JSON.stringify([jsonPacket]),
    });
  });

  afterEach(function () {
    restore();
  });

  it('should encode buffer to packet from stdin', async function () {
    const payload = new Payload(givenSomePayloadProps());
    const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');

    when(payloadFactory.create(anything(), anything())).thenReturn(payload);
    when(packetMapper.fromDomain(anything())).thenReturn(buffer);

    command.action('-');

    stdio.stdin.end(JSON.stringify([jsonPacket]));

    const [ret] = await readStream(stdio.stdout, 'hex');

    expect(ret).to.be.equal('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c');

    verify(
      payloadFactory.create(deepEqual(OPCode.fromName('DEVICE_GETTIME_RSP')), deepEqual(jsonPacket.payload.object)),
    ).once();
    verify(
      packetMapper.fromDomain(
        deepEqual(
          new Packet({
            ctype: jsonPacket.ctype,
            flow: jsonPacket.flow,
            userId: new ID(jsonPacket.userId),
            deviceId: new ID(jsonPacket.deviceId),
            sequence: PacketSequence.fromString(jsonPacket.sequence),
            payload,
          }),
        ),
      ),
    ).once();
  });

  it('should encode buffer to packet from file', async function () {
    const payload = new Payload(givenSomePayloadProps());
    const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');

    when(payloadFactory.create(anything(), anything())).thenReturn(payload);
    when(packetMapper.fromDomain(anything())).thenReturn(buffer);

    command.action(filename);

    const [ret] = await readStream(stdio.stdout, 'hex');

    expect(ret).to.be.equal('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c');

    verify(
      payloadFactory.create(deepEqual(OPCode.fromName('DEVICE_GETTIME_RSP')), deepEqual(jsonPacket.payload.object)),
    ).once();
    verify(
      packetMapper.fromDomain(
        deepEqual(
          new Packet({
            ctype: jsonPacket.ctype,
            flow: jsonPacket.flow,
            userId: new ID(jsonPacket.userId),
            deviceId: new ID(jsonPacket.deviceId),
            sequence: PacketSequence.fromString(jsonPacket.sequence),
            payload,
          }),
        ),
      ),
    ).once();
  });

  it('should write to stderr when an error is thrown', async function () {
    const payload = new Payload(givenSomePayloadProps());

    when(payloadFactory.create(anything(), anything())).thenReturn(payload);
    when(packetMapper.fromDomain(anything())).thenThrow(new Error('some error'));

    command.action('-');

    stdio.stdin.end(JSON.stringify([jsonPacket]));

    const [ret] = await readStream(stdio.stderr, 'utf8');

    expect(ret).to.include('Error: some error\n');
  });
});
