import { DomainException } from '@agnoc/toolkit';
import { Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { verify, anything, imock, instance, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { readStream } from '../test-support';
import { PacketDecodeTransform } from './packet-decode-transform.stream';
import type { PacketMapper } from '@agnoc/transport-tcp';

describe('PacketDecodeTransform', function () {
  let packetMapper: PacketMapper;
  let stream: PacketDecodeTransform;
  let packet: Packet;

  beforeEach(function () {
    packet = new Packet(givenSomePacketProps());
    packetMapper = imock();
    stream = new PacketDecodeTransform(instance(packetMapper));
  });

  it('should convert an stream of buffer chunks to a packet stream', async function () {
    const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    stream.end(buffer);

    const [ret] = await readStream(stream);

    expect(ret).to.be.equal(packet);
  });

  it('should convert a big chunk', async function () {
    const buffer = Buffer.from(
      '2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c',
      'hex',
    );

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    stream.end(buffer);

    const [packet1, packet2] = await readStream(stream);

    expect(packet1).to.be.equal(packet);
    expect(packet2).to.be.equal(packet);

    verify(packetMapper.toDomain(anything())).twice();
  });

  it('should convert a chunk with two small chunks', async function () {
    const chunk1 = Buffer.from('2500000002010100000002000000128c97', 'hex');
    const chunk2 = Buffer.from('bb0f9a477a121008001a090893afeefd0510901c', 'hex');

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    stream.write(chunk1);
    stream.end(chunk2);

    const [ret] = await readStream(stream);

    expect(ret).to.be.equal(packet);
  });

  it('should convert a big chunk with two small chunks', async function () {
    const chunk1 = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c25', 'hex');
    const chunk2 = Buffer.from('00000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    stream.write(chunk1);
    stream.end(chunk2);

    const [packet1, packet2] = await readStream(stream);

    expect(packet1).to.be.equal(packet);
    expect(packet2).to.be.equal(packet);

    verify(packetMapper.toDomain(anything())).twice();
  });

  it('should throw an error when failing to map a packet', async function () {
    const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');
    const error = new Error('unable to map packet');

    when(packetMapper.toDomain(anything())).thenThrow(error);

    stream.end(buffer);

    await expect(readStream(stream)).to.be.rejectedWith(error);
  });

  it('should throw an error when ending the stream with partial chunks', async function () {
    const buffer = Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c00', 'hex');

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    stream.end(buffer);

    await expect(readStream(stream)).to.be.rejectedWith(
      DomainException,
      `Unable to decode 1 byte(s). Possible malformed data stream`,
    );
  });
});
