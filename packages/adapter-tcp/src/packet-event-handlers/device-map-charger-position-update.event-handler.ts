import { MapPosition } from '@agnoc/domain';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceMapChargerPositionUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(message: PacketMessage<'DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO'>): Promise<void> {
    message.assertDevice();

    if (message.device.map) {
      const data = message.packet.payload.data;

      message.device.map.updateCharger(
        new MapPosition({
          x: data.poseX,
          y: data.poseY,
          phi: data.posePhi,
        }),
      );

      message.device.updateMap(message.device.map);

      await this.deviceRepository.saveOne(message.device);
    }
  }
}
