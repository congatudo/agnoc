import { DeviceMap, MapPosition } from '@agnoc/domain';
import { givenSomeDeviceMapProps } from '@agnoc/domain/test-support';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { DeviceCleaningService } from './device-cleaning.service';
import { ModeCtrlValue } from './device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { ConnectionWithDevice, Device } from '@agnoc/domain';

describe('DeviceCleaningService', function () {
  let service: DeviceCleaningService;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    service = new DeviceCleaningService();
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  describe('#autoCleaning()', function () {
    it('should start auto cleaning', async function () {
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));

      await service.autoCleaning(instance(packetConnection), ModeCtrlValue.Start);

      verify(packetConnection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', deepEqual({ ctrlValue: 1, cleanType: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
    });
  });

  describe('#mopCleaning()', function () {
    it('should start mop cleaning', async function () {
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));

      await service.mopCleaning(instance(packetConnection), ModeCtrlValue.Start);

      verify(packetConnection.sendAndWait('DEVICE_MOP_FLOOR_CLEAN_REQ', deepEqual({ ctrlValue: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_MOP_FLOOR_CLEAN_RSP')).once();
    });
  });

  describe('#spotCleaning()', function () {
    it('should start spot cleaning with map id', async function () {
      const deviceMap = new DeviceMap({ ...givenSomeDeviceMapProps(), id: new ID(1) });

      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.map).thenReturn(deviceMap);

      await service.spotCleaning(
        instance(packetConnection),
        new MapPosition({ x: 1, y: 2, phi: 3 }),
        ModeCtrlValue.Start,
      );

      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_NAVIGATION_REQ',
          deepEqual({
            mapHeadId: 1,
            poseX: 1,
            poseY: 2,
            posePhi: 3,
            ctrlValue: 1,
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP')).once();
    });

    it('should start spot cleaning with no map id', async function () {
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.map).thenReturn(undefined);

      await service.spotCleaning(
        instance(packetConnection),
        new MapPosition({ x: 1, y: 2, phi: 3 }),
        ModeCtrlValue.Start,
      );

      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_NAVIGATION_REQ',
          deepEqual({
            mapHeadId: 0,
            poseX: 1,
            poseY: 2,
            posePhi: 3,
            ctrlValue: 1,
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP')).once();
    });
  });

  describe('#zoneCleaning()', function () {
    it('should start zone cleaning', async function () {
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));

      await service.zoneCleaning(instance(packetConnection), ModeCtrlValue.Start);

      verify(packetConnection.sendAndWait('DEVICE_AREA_CLEAN_REQ', deepEqual({ ctrlValue: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AREA_CLEAN_RSP')).once();
    });
  });
});
