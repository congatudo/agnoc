import { DeviceMap, MapCoordinate, Room, Zone } from '@agnoc/domain';
import { givenSomeDeviceMapProps, givenSomeRoomProps } from '@agnoc/domain/test-support';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { DeviceMapService } from './device-map.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { ConnectionWithDevice, Device } from '@agnoc/domain';

describe('DeviceMapService', function () {
  let service: DeviceMapService;
  let packetConnection: PacketConnection & ConnectionWithDevice<DeviceWithMap>;
  let packetMessage: PacketMessage;
  let device: DeviceWithMap;

  beforeEach(function () {
    service = new DeviceMapService();
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  describe('#setMapZones()', function () {
    it('should set map zones with map id', async function () {
      const deviceMap = new DeviceMap({ ...givenSomeDeviceMapProps(), id: new ID(1) });
      const zones = [
        new Zone({
          id: new ID(1),
          coordinates: [new MapCoordinate({ x: 1, y: 2 }), new MapCoordinate({ x: 3, y: 4 })],
        }),
        new Zone({
          id: new ID(2),
          coordinates: [new MapCoordinate({ x: 5, y: 6 }), new MapCoordinate({ x: 7, y: 8 })],
        }),
      ];

      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.map).thenReturn(deviceMap);

      await service.setMapZones(instance(packetConnection), zones);

      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ',
          deepEqual({
            mapHeadId: 1,
            planId: 0,
            cleanAreaLength: 2,
            cleanAreaList: [
              {
                cleanAreaId: 1,
                type: 0,
                coordinateLength: 2,
                coordinateList: [
                  { x: 1, y: 2 },
                  { x: 3, y: 4 },
                ],
              },
              {
                cleanAreaId: 2,
                type: 0,
                coordinateLength: 2,
                coordinateList: [
                  { x: 5, y: 6 },
                  { x: 7, y: 8 },
                ],
              },
            ],
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP')).once();
    });
  });

  describe('#enableWholeClean()', function () {
    it('should enable whole clean', async function () {
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        id: new ID(1),
        rooms: [new Room({ ...givenSomeRoomProps(), id: new ID(1), name: 'Room 1' })],
        restrictedZones: [new Zone({ id: new ID(1), coordinates: [new MapCoordinate({ x: 0, y: 0 })] })],
      });

      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.map).thenReturn(deviceMap);

      await service.enableWholeClean(instance(packetConnection));

      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_PLAN_PARAMS_REQ',
          deepEqual({
            mapHeadId: 1,
            mapName: 'Default',
            planId: 2,
            planName: 'Default',
            roomList: [{ roomId: 1, roomName: 'Room 1', enable: true }],
            areaInfo: {
              mapHeadId: 1,
              planId: 2,
              cleanAreaLength: 1,
              cleanAreaList: [{ cleanAreaId: 1, type: 0, coordinateLength: 1, coordinateList: [{ x: 0, y: 0 }] }],
            },
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_PLAN_PARAMS_RSP')).once();
    });
  });
});

interface DeviceWithMap extends Device {
  map: DeviceMap;
}
