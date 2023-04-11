import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { ConnectionWithDevice, Device, DeviceMap, Zone } from '@agnoc/domain';

export class DeviceMapService {
  async setMapZones(connection: PacketConnection & ConnectionWithDevice<DeviceWithMap>, zones: Zone[]): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ', {
      mapHeadId: connection.device.map.id.value,
      planId: 0,
      cleanAreaLength: zones.length,
      cleanAreaList: zones.map((zone) => {
        return {
          cleanAreaId: zone.id.value,
          type: 0,
          coordinateLength: zone.coordinates.length,
          coordinateList: zone.coordinates.map(({ x, y }) => ({ x, y })),
        };
      }),
    });

    response.assertPayloadName('DEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP');
  }

  async enableWholeClean(connection: PacketConnection & ConnectionWithDevice<DeviceWithMap>): Promise<void> {
    const { id, restrictedZones, rooms } = connection.device.map;
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_PLAN_PARAMS_REQ', {
      mapHeadId: id.value,
      // FIXME: this will change user map name.
      mapName: 'Default',
      planId: 2,
      // FIXME: this will change user plan name.
      planName: 'Default',
      roomList: rooms.map((room) => ({
        roomId: room.id.value,
        roomName: room.name,
        enable: true,
      })),
      areaInfo: {
        mapHeadId: id.value,
        planId: 2,
        cleanAreaLength: restrictedZones.length,
        cleanAreaList: restrictedZones.map((zone) => ({
          cleanAreaId: zone.id.value,
          type: 0,
          coordinateLength: zone.coordinates.length,
          coordinateList: zone.coordinates.map(({ x, y }) => ({ x, y })),
        })),
      },
    });

    response.assertPayloadName('DEVICE_MAPID_SET_PLAN_PARAMS_RSP');
  }
}

interface DeviceWithMap extends Device {
  map: DeviceMap;
}
