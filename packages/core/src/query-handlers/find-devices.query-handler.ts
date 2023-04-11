import type { QueryHandler, FindDevicesQueryOutput, DeviceRepository, FindDevicesQuery } from '@agnoc/domain';

export class FindDevicesQueryHandler implements QueryHandler {
  readonly forName = 'FindDevicesQuery';

  constructor(private readonly deviceRepository: DeviceRepository) {}

  async handle(_: FindDevicesQuery): Promise<FindDevicesQueryOutput> {
    const devices = await this.deviceRepository.findAll();

    return { devices };
  }
}
