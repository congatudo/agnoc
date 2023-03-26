import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceLockedEventHandler } from './device-locked.event-handler';
import type { PacketMessage } from '../packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceLockedEventHandler', function () {
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceLockedEventHandler;
  let packetMessage: PacketMessage<'DEVICE_CONTROL_LOCK_RSP'>;
  let device: Device;

  beforeEach(function () {
    deviceRepository = imock();
    eventHandler = new DeviceLockedEventHandler(instance(deviceRepository));
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_CONTROL_LOCK_RSP');
  });

  describe('#handle()', function () {
    it('should lock the device when is not locked', async function () {
      when(packetMessage.device).thenReturn(instance(device));
      when(device.isLocked).thenReturn(false);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(device.setAsLocked()).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when device is already locked', async function () {
      when(packetMessage.device).thenReturn(instance(device));
      when(device.isLocked).thenReturn(true);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(device.setAsLocked()).never();
      verify(deviceRepository.saveOne(anything())).never();
    });
  });
});
