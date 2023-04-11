import { Device } from '@agnoc/domain';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { capture, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceRegisterEventHandler } from './device-register.event-handler';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceRepository } from '@agnoc/domain';

describe('DeviceRegisterEventHandler', function () {
  let eventHandler: DeviceRegisterEventHandler;
  let packetMessage: PacketMessage<'DEVICE_REGISTER_REQ'>;
  let deviceRepository: DeviceRepository;

  beforeEach(function () {
    deviceRepository = imock();
    eventHandler = new DeviceRegisterEventHandler(instance(deviceRepository));
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_REGISTER_REQ');
  });

  describe('#handle()', function () {
    it('should create a device', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_REGISTER_REQ'),
        data: {
          deviceType: 9,
          deviceSerialNumber: '1234567890',
          softwareVersion: '1.0.0',
          hardwareVersion: '1.0.0',
          deviceMac: '00:00:00:00:00:00',
          customerFirmwareId: 1,
          ctrlVersion: '1.0.0',
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);

      await eventHandler.handle(instance(packetMessage));

      const [device] = capture(deviceRepository.saveOne).first();

      expect(device).to.be.instanceOf(Device);
      expect(device.id).to.exist;
      expect(device.userId).to.exist;
      expect(device.system.type).to.be.equal(9);
      expect(device.system.serialNumber).to.be.equal('1234567890');
      expect(device.version.software).to.be.equal('1.0.0');
      expect(device.version.hardware).to.be.equal('1.0.0');
      expect(device.battery.value).to.be.equal(100);
      expect(device.isConnected).to.be.false;
      expect(device.isLocked).to.be.false;

      verify(
        packetMessage.respond('DEVICE_REGISTER_RSP', deepEqual({ result: 0, device: { id: device.id.value } })),
      ).once();
    });
  });
});
