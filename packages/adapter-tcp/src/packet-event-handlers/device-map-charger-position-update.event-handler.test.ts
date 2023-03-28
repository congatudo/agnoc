import { MapPosition } from '@agnoc/domain';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceMapChargerPositionUpdateEventHandler } from './device-map-charger-position-update.event-handler';
import type { PacketMessage } from '../packet.message';
import type { Device, DeviceRepository, DeviceMap } from '@agnoc/domain';

describe('DeviceMapChargerPositionUpdateEventHandler', function () {
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceMapChargerPositionUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO'>;
  let device: Device;
  let deviceMap: DeviceMap;

  beforeEach(function () {
    deviceRepository = imock();
    eventHandler = new DeviceMapChargerPositionUpdateEventHandler(instance(deviceRepository));
    packetMessage = imock();
    device = imock();
    deviceMap = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO');
  });

  describe('#handle()', function () {
    it('should update the device network', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO'),
        data: {
          poseId: 0,
          poseX: 1,
          poseY: 2,
          posePhi: 3,
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceMap.updateCharger(deepEqual(new MapPosition({ x: 1, y: 2, phi: 3 })))).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when device has no map', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO'),
        data: {
          poseId: 0,
          poseX: 1,
          poseY: 2,
          posePhi: 3,
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(undefined);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceMap.updateCharger(anything())).never();
      verify(device.updateMap(anything())).never();
      verify(deviceRepository.saveOne(anything())).never();
    });
  });
});
