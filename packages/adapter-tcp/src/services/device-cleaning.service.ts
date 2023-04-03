import type { ModeCtrlValue } from './device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { ConnectionWithDevice, MapPosition } from '@agnoc/domain';

export class DeviceCleaningService {
  async zoneCleaning(connection: PacketConnection & ConnectionWithDevice, mode: ModeCtrlValue): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AREA_CLEAN_REQ', {
      ctrlValue: mode,
    });

    response.assertPayloadName('DEVICE_AREA_CLEAN_RSP');
  }

  async spotCleaning(
    connection: PacketConnection & ConnectionWithDevice,
    position: MapPosition,
    mode: ModeCtrlValue,
  ): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_NAVIGATION_REQ', {
      mapHeadId: connection.device.map?.id.value ?? 0,
      poseX: position.x,
      poseY: position.y,
      posePhi: position.phi,
      ctrlValue: mode,
    });

    response.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP');
  }

  async mopCleaning(connection: PacketConnection & ConnectionWithDevice, mode: ModeCtrlValue): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MOP_FLOOR_CLEAN_REQ', {
      ctrlValue: mode,
    });

    response.assertPayloadName('DEVICE_MOP_FLOOR_CLEAN_RSP');
  }

  async autoCleaning(connection: PacketConnection & ConnectionWithDevice, mode: ModeCtrlValue): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', {
      ctrlValue: mode,
      cleanType: 2,
    });

    response.assertPayloadName('DEVICE_AUTO_CLEAN_RSP');
  }
}
