import { readStream } from '@agnoc/test-support';
import { ID } from '@agnoc/toolkit';
import { OPCode, Packet, PacketSequence, Payload } from '@agnoc/transport-tcp';
import { anything, imock, instance, when, verify, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { givenAJSONPacket } from '../test-support';
import { PacketEncodeTransform } from './packet-encode-transform.stream';
import type { PacketMapper } from '@agnoc/transport-tcp';

describe('PacketEncodeTransform', function () {
  let packetMapper: PacketMapper;
  let stream: PacketEncodeTransform;

  beforeEach(function () {
    packetMapper = imock();
    stream = new PacketEncodeTransform(instance(packetMapper));
  });

  it('should transform a json stream to a packet stream', async function () {
    const jsonPacket = givenAJSONPacket();
    const buffer = Buffer.from('example');

    when(packetMapper.fromDomain(anything())).thenReturn(buffer);

    stream.end([jsonPacket]);

    const [ret] = await readStream(stream);

    expect(ret).to.be.equal(buffer);

    verify(
      packetMapper.fromDomain(
        deepEqual(
          new Packet({
            ctype: jsonPacket.ctype,
            flow: jsonPacket.flow,
            userId: new ID(jsonPacket.userId),
            deviceId: new ID(jsonPacket.deviceId),
            sequence: PacketSequence.fromString(jsonPacket.sequence),
            payload: new Payload({
              opcode: OPCode.fromName(jsonPacket.payload.opcode),
              object: jsonPacket.payload.object,
            }),
          }),
        ),
      ),
    ).once();
  });
});
