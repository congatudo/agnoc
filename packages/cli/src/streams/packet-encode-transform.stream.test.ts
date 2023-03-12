import { ID } from '@agnoc/toolkit';
import { OPCode, Packet, PacketSequence, Payload } from '@agnoc/transport-tcp';
import { givenSomePayloadProps } from '@agnoc/transport-tcp/test-support';
import { anything, imock, instance, when, verify, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { givenAJSONPacket } from '../test-support';
import { PacketEncodeTransform } from './packet-encode-transform.stream';
import type { PacketMapper, PayloadFactory } from '@agnoc/transport-tcp';

describe('PacketEncodeTransform', function () {
  let packetMapper: PacketMapper;
  let payloadFactory: PayloadFactory;
  let stream: PacketEncodeTransform;

  beforeEach(function () {
    packetMapper = imock();
    payloadFactory = imock();
    stream = new PacketEncodeTransform(instance(packetMapper), instance(payloadFactory));
  });

  it('should transform a json stream to a packet stream', function () {
    const jsonPacket = givenAJSONPacket();
    const payload = new Payload(givenSomePayloadProps());
    const buffer = Buffer.from('example');

    when(payloadFactory.create(anything(), anything())).thenReturn(payload);
    when(packetMapper.fromDomain(anything())).thenReturn(buffer);

    stream.end([jsonPacket]);

    const ret = stream.read() as Buffer;

    expect(ret).to.be.equal(buffer);

    verify(payloadFactory.create(deepEqual(OPCode.fromName('DEVICE_GETTIME_RSP')), jsonPacket.payload.object)).once();
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
});
