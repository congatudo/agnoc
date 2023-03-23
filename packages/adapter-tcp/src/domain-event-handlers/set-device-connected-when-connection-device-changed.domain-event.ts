import type {
  DomainEventHandler,
  ConnectionRepository,
  DeviceRepository,
  ConnectionDeviceChangedDomainEvent,
} from '@agnoc/domain';

export class SetDeviceAsConnectedWhenConnectionDeviceAddedDomainEventHandler implements DomainEventHandler {
  readonly forName = 'ConnectionDeviceChangedDomainEvent';

  constructor(
    private readonly connectionRepository: ConnectionRepository,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(event: ConnectionDeviceChangedDomainEvent): Promise<void> {
    if (event.currentDeviceId) {
      const connections = await this.connectionRepository.findByDeviceId(event.currentDeviceId);
      const device = await this.deviceRepository.findOneById(event.currentDeviceId);

      // This is a hack to only mark the device as connected if there is more than one connection.
      // Here we should check that the connections are from the same ip address.
      if (connections.length > 1 && device && !device.isConnected) {
        device.setAsConnected();

        await this.deviceRepository.saveOne(device);
      }
    }

    // TODO: handle device disconnection
  }
}
