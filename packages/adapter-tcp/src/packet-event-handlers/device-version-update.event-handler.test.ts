import { DeviceVersion } from '@agnoc/domain';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { capture, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceVersionUpdateEventHandler } from './device-version-update.event-handler';
import type { PacketMessage } from '../objects/packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceVersionUpdateEventHandler', function () {
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceVersionUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_VERSION_INFO_UPDATE_REQ'>;
  let device: Device;

  beforeEach(function () {
    deviceRepository = imock();
    eventHandler = new DeviceVersionUpdateEventHandler(instance(deviceRepository));
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_VERSION_INFO_UPDATE_REQ');
  });

  describe('#handle()', function () {
    it('should update the device version', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_VERSION_INFO_UPDATE_REQ'),
        data: { softwareVersion: '1.0.0', hardwareVersion: '1.0.0' },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      const [deviceVersion] = capture(device.updateVersion).first();

      expect(deviceVersion).to.be.instanceOf(DeviceVersion);
      expect(deviceVersion.software).to.be.equal('1.0.0');
      expect(deviceVersion.hardware).to.be.equal('1.0.0');

      verify(packetMessage.assertDevice()).once();
      verify(deviceRepository.saveOne(instance(device))).once();
      verify(packetMessage.respond('DEVICE_VERSION_INFO_UPDATE_RSP', deepEqual({ result: 0 }))).once();
    });
  });
});
