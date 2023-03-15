import { ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { PacketSequence } from '../domain-primitives/packet-sequence.domain-primitive';
import { givenSomePacketProps } from '../test-support';
import { Packet } from '../value-objects/packet.value-object';
import { PacketFactory } from './packet.factory';

describe('PacketFactory', function () {
  let packetFactory: PacketFactory;

  beforeEach(function () {
    packetFactory = new PacketFactory();
  });

  it('should create a packet from some props', function () {
    const object = { result: 0, body: { deviceTime: 1606129555 } };
    const props = { userId: new ID(1), deviceId: new ID(2) };
    const packet = packetFactory.create('DEVICE_GETTIME_RSP', object, props);

    expect(packet).to.be.instanceOf(Packet);
    expect(packet.ctype).to.equal(2);
    expect(packet.flow).to.equal(0);
    expect(packet.userId).to.equal(props.deviceId);
    expect(packet.deviceId).to.equal(props.userId);
    expect(packet.sequence).to.be.instanceOf(PacketSequence);
    expect(packet.payload.opcode.name).to.equal('DEVICE_GETTIME_RSP');
    expect(packet.payload.object).to.equal(object);
  });

  it('should create a packet from another packet', function () {
    const sourcePacketProps = { ...givenSomePacketProps(), flow: 0 };
    const sourcePacket = new Packet(sourcePacketProps);
    const object = { result: 0, body: { deviceTime: 1606129555 } };
    const packet = packetFactory.create('DEVICE_GETTIME_RSP', object, sourcePacket);

    expect(packet).to.be.instanceOf(Packet);
    expect(packet.ctype).to.equal(sourcePacketProps.ctype);
    expect(packet.flow).to.equal(1);
    expect(packet.userId).to.equal(sourcePacketProps.deviceId);
    expect(packet.deviceId).to.equal(sourcePacketProps.userId);
    expect(packet.sequence).to.be.equal(sourcePacketProps.sequence);
    expect(packet.payload.opcode.name).to.equal('DEVICE_GETTIME_RSP');
    expect(packet.payload.object).to.equal(object);
  });
});
