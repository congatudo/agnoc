import { MapPosition } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { PacketEventHandler } from '../../packet.event-handler';
import type { PacketMessage } from '../../packet.message';

export class DeviceMapChargerPositionUpdateEventHandler implements PacketEventHandler {
  readonly eventName = 'DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO';

  async handle(message: PacketMessage<'DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO'>): Promise<void> {
    if (!message.device) {
      throw new DomainException('Device not found');
    }

    const data = message.packet.payload.object;

    message.device.map?.updateCharger(
      new MapPosition({
        x: data.poseX,
        y: data.poseY,
        phi: data.posePhi,
      }),
    );

    // TODO: save entity and publish domain event
  }
}
