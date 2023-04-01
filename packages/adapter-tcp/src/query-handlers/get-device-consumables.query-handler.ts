import { DeviceConsumable, DeviceConsumableType } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type {
  GetDeviceConsumablesQuery,
  GetDeviceConsumablesQueryOutput,
  QueryHandler,
  DeviceRepository,
  ConnectionWithDevice,
  Device,
} from '@agnoc/domain';

export class GetDeviceConsumablesQueryHandler implements QueryHandler {
  readonly forName = 'GetDeviceConsumablesQuery';

  constructor(
    private readonly packetConnectionFinderService: PacketConnectionFinderService,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: GetDeviceConsumablesQuery): Promise<GetDeviceConsumablesQueryOutput> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      throw new DomainException(`Unable to find a device connected with id ${event.deviceId.value}`);
    }

    const consumables = await this.getConsumables(connection);

    await this.updateDeviceConsumables(connection, consumables);

    return { consumables };
  }

  private async getConsumables(connection: PacketConnection & ConnectionWithDevice<Device>) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ', {});

    response.assertPayloadName('DEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP');

    const data = response.packet.payload.data;
    const consumables = [
      new DeviceConsumable({
        type: DeviceConsumableType.MainBrush,
        hoursUsed: data.mainBrushTime,
      }),
      new DeviceConsumable({
        type: DeviceConsumableType.SideBrush,
        hoursUsed: data.sideBrushTime,
      }),
      new DeviceConsumable({
        type: DeviceConsumableType.Filter,
        hoursUsed: data.filterTime,
      }),
      new DeviceConsumable({
        type: DeviceConsumableType.Dishcloth,
        hoursUsed: data.dishclothTime,
      }),
    ];
    return consumables;
  }

  private async updateDeviceConsumables(
    connection: PacketConnection & ConnectionWithDevice<Device>,
    consumables: DeviceConsumable[],
  ) {
    connection.device.updateConsumables(consumables);

    await this.deviceRepository.saveOne(connection.device);
  }
}
