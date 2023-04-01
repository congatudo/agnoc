import { DeviceConsumable, DeviceConsumableType } from '@agnoc/domain';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type {
  CommandHandler,
  ResetConsumableCommand,
  DeviceRepository,
  ConnectionWithDevice,
  Device,
} from '@agnoc/domain';

export class ResetConsumableCommandHandler implements CommandHandler {
  readonly forName = 'ResetConsumableCommand';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: ResetConsumableCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    await this.resetConsumable(connection, event);
    await this.updateDeviceConsumables(connection, event);
  }

  private async resetConsumable(
    connection: PacketConnection & ConnectionWithDevice<Device>,
    event: ResetConsumableCommand,
  ) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ', {
      itemId: DeviceConsumableItemId[event.consumable.type],
    });

    response.assertPayloadName('DEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP');
  }

  private async updateDeviceConsumables(
    connection: PacketConnection & ConnectionWithDevice<Device>,
    event: ResetConsumableCommand,
  ) {
    const resetConsumable = new DeviceConsumable({
      type: event.consumable.type,
      hoursUsed: 0,
    });
    const consumables = connection.device.consumables?.map((consumable) => {
      if (consumable.type === event.consumable.type) {
        return resetConsumable;
      }

      return consumable;
    });

    connection.device.updateConsumables(consumables ?? [resetConsumable]);

    await this.deviceRepository.saveOne(connection.device);
  }
}

const DeviceConsumableItemId = {
  [DeviceConsumableType.MainBrush]: 1,
  [DeviceConsumableType.SideBrush]: 2,
  [DeviceConsumableType.Filter]: 3,
  [DeviceConsumableType.Dishcloth]: 4,
};
