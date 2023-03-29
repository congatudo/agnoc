import type { PacketEventHandler } from '../base-classes/packet.event-handler';
import type { DeviceOrderMapper } from '../mappers/device-order.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceOrderListUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_ORDERLIST_GETTING_RSP';

  constructor(
    private readonly deviceOrderMapper: DeviceOrderMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(message: PacketMessage<'DEVICE_ORDERLIST_GETTING_RSP'>): Promise<void> {
    message.assertDevice();

    const data = message.packet.payload.data;

    if (data.orderList) {
      const deviceOrders = data.orderList?.map((order) => this.deviceOrderMapper.toDomain(order));

      message.device.updateOrders(deviceOrders);

      await this.deviceRepository.saveOne(message.device);
    }
  }
}
