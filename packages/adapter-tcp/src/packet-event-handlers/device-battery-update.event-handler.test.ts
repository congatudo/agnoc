import { DeviceBattery } from '@agnoc/domain';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceBatteryUpdateEventHandler } from './device-battery-update.event-handler';
import type { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import type { PacketMessage } from '../packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceBatteryUpdateEventHandler', function () {
  let deviceBatteryMapper: DeviceBatteryMapper;
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceBatteryUpdateEventHandler;
  let packetMessage: PacketMessage<'PUSH_DEVICE_BATTERY_INFO_REQ'>;
  let device: Device;

  beforeEach(function () {
    deviceBatteryMapper = imock();
    deviceRepository = imock();
    eventHandler = new DeviceBatteryUpdateEventHandler(instance(deviceBatteryMapper), instance(deviceRepository));
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('PUSH_DEVICE_BATTERY_INFO_REQ');
  });

  describe('#handle()', function () {
    it('should update the device battery', async function () {
      const deviceBattery = new DeviceBattery(5);
      const payload = new Payload({
        opcode: OPCode.fromName('PUSH_DEVICE_BATTERY_INFO_REQ'),
        data: { battery: { level: 1 } },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(deviceBatteryMapper.toDomain(anything())).thenReturn(deviceBattery);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceBatteryMapper.toDomain(1)).once();
      verify(device.updateBattery(deviceBattery)).once();
      verify(deviceRepository.saveOne(instance(device))).once();
      verify(packetMessage.respond('PUSH_DEVICE_BATTERY_INFO_RSP', deepEqual({ result: 0 }))).once();
    });
  });
});
