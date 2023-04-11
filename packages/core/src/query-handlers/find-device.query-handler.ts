import { DomainException } from '@agnoc/toolkit';
import type { DeviceRepository, FindDeviceQuery, FindDeviceQueryOutput, QueryHandler } from '@agnoc/domain';

export class FindDeviceQueryHandler implements QueryHandler {
  readonly forName = 'FindDeviceQuery';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(event: FindDeviceQuery): Promise<FindDeviceQueryOutput> {
    const device = await this.deviceRepository.findOneById(event.deviceId);

    if (!device) {
      throw new DomainException(`Unable to find a device with id ${event.deviceId.value}`);
    }

    return { device };
  }
}
