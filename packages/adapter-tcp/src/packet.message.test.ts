import { Device } from '@agnoc/domain';
import { givenSomeDeviceProps } from '@agnoc/domain/test-support';
import { DomainException } from '@agnoc/toolkit';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps, givenSomePayloadProps } from '@agnoc/transport-tcp/test-support';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketMessage } from './packet.message';
import type { PacketConnection } from './aggregate-roots/packet-connection.aggregate-root';

describe('PacketMessage', function () {
  let packetConnection: PacketConnection;
  let packet: Packet;
  let packetMessage: PacketMessage;

  beforeEach(function () {
    packetConnection = imock();
    packet = imock();
    packetMessage = new PacketMessage(instance(packetConnection), instance(packet));
  });

  it('should be created', function () {
    const device = new Device(givenSomeDeviceProps());

    when(packetConnection.device).thenReturn(device);

    expect(packetMessage).to.exist;
    expect(packetMessage.device).to.be.equal(device);
  });

  describe('#respond()', function () {
    it('should respond to the connection', async function () {
      const data = { result: 0, body: { deviceTime: 1 } };

      when(packetConnection.respond(anything(), anything(), anything())).thenResolve(undefined);

      await packetMessage.respond('DEVICE_GETTIME_RSP', data);

      verify(packetConnection.respond('DEVICE_GETTIME_RSP', data, instance(packet))).once();
    });
  });

  describe('#respondAndWait()', function () {
    it('should respond to the connection and wait for the response', async function () {
      const data = { result: 0, body: { deviceTime: 1 } };
      const anotherPacketMessage = new PacketMessage(instance(packetConnection), instance(packet));

      when(packetConnection.respondAndWait(anything(), anything(), anything())).thenResolve(anotherPacketMessage);

      const ret = await packetMessage.respondAndWait('DEVICE_GETTIME_RSP', data);

      expect(ret).to.be.equal(anotherPacketMessage);

      verify(packetConnection.respondAndWait('DEVICE_GETTIME_RSP', data, instance(packet))).once();
    });
  });

  describe('#hasPayloadName()', function () {
    it('should return true when the payload name is the same', function () {
      const opcode = OPCode.fromName('DEVICE_GETTIME_RSP');
      const payload = new Payload({ ...givenSomePayloadProps(), opcode });
      const packet = new Packet({ ...givenSomePacketProps(), payload });
      const packetMessage = new PacketMessage(instance(packetConnection), packet);

      expect(packetMessage.hasPayloadName('DEVICE_GETTIME_RSP')).to.be.true;
    });

    it('should return false when the payload name is not the same', function () {
      const opcode = OPCode.fromName('DEVICE_GETTIME_RSP');
      const payload = new Payload({ ...givenSomePayloadProps(), opcode });
      const packet = new Packet({ ...givenSomePacketProps(), payload });
      const packetMessage = new PacketMessage(instance(packetConnection), packet);

      expect(packetMessage.hasPayloadName('DEVICE_GETTIME_REQ')).to.be.false;
    });
  });

  describe('#assertPayloadName()', function () {
    it('should throw an error when the payload name is not the same', function () {
      const opcode = OPCode.fromName('DEVICE_GETTIME_RSP');
      const payload = new Payload({ ...givenSomePayloadProps(), opcode });
      const packet = new Packet({ ...givenSomePacketProps(), payload });
      const packetMessage = new PacketMessage(instance(packetConnection), packet);

      expect(() => packetMessage.assertPayloadName('DEVICE_GETTIME_REQ')).to.throw(
        DomainException,
        `Unexpected packet with payload name 'DEVICE_GETTIME_RSP', expecting 'DEVICE_GETTIME_REQ'`,
      );
    });

    it('should not throw an error when the payload name is the same', function () {
      const opcode = OPCode.fromName('DEVICE_GETTIME_RSP');
      const payload = new Payload({ ...givenSomePayloadProps(), opcode });
      const packet = new Packet({ ...givenSomePacketProps(), payload });
      const packetMessage = new PacketMessage(instance(packetConnection), packet);

      expect(() => packetMessage.assertPayloadName('DEVICE_GETTIME_RSP')).to.not.throw(DomainException);
    });
  });

  describe('#assertDevice()', function () {
    it('should throw an error when the connection does not has a device set', function () {
      when(packetConnection.device).thenReturn(undefined);

      expect(() => packetMessage.assertDevice()).to.throw(
        DomainException,
        'Connection does not have a reference to a device',
      );
    });

    it('should not throw an error when the connection has a device set', function () {
      const device = new Device(givenSomeDeviceProps());

      when(packetConnection.device).thenReturn(device);

      expect(() => packetMessage.assertDevice()).to.not.throw(DomainException);
    });
  });
});
