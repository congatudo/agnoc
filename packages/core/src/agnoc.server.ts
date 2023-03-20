import { CommandEventBus, DeviceRepository, DomainEventBus } from '@agnoc/domain';
import { EventHandlerRegistry, MemoryAdapter } from '@agnoc/toolkit';
import type { DomainEventNames, DomainEvents, CommandEventNames, CommandEvents } from '@agnoc/domain';
import type { Server } from '@agnoc/toolkit';

export class AgnocServer implements Server {
  private readonly domainEventBus: DomainEventBus;
  private readonly domainEventHandlerRegistry: EventHandlerRegistry;
  private readonly commandEventBus: CommandEventBus;
  private readonly commandEventHandlerRegistry: EventHandlerRegistry;
  private readonly deviceRepository: DeviceRepository;
  private readonly adapters = new Set<Server>();

  constructor() {
    this.domainEventBus = new DomainEventBus();
    this.domainEventHandlerRegistry = new EventHandlerRegistry(this.domainEventBus);
    this.commandEventBus = new CommandEventBus();
    this.commandEventHandlerRegistry = new EventHandlerRegistry(this.commandEventBus);
    this.deviceRepository = new DeviceRepository(this.domainEventBus, new MemoryAdapter());
  }

  subscribe<Name extends DomainEventNames>(eventName: Name, handler: SubscribeHandler<Name>): void {
    this.domainEventBus.on(eventName, handler);
  }

  trigger<Name extends CommandEventNames>(eventName: Name, payload: CommandEvents[Name]): Promise<void> {
    return this.commandEventBus.emit(eventName, payload);
  }

  buildAdapter(builder: AdapterFactory): void {
    const adapter = builder({
      domainEventHandlerRegistry: this.domainEventHandlerRegistry,
      commandEventHandlerRegistry: this.commandEventHandlerRegistry,
      deviceRepository: this.deviceRepository,
    });

    this.adapters.add(adapter);
  }

  async listen(): Promise<void> {
    await Promise.all([...this.adapters].map((adapter) => adapter.listen()));
  }

  async close(): Promise<void> {
    await Promise.all([...this.adapters].map((adapter) => adapter.close()));
  }
}

type AdapterFactory = (container: Container) => Server;

export type Container = {
  domainEventHandlerRegistry: EventHandlerRegistry;
  commandEventHandlerRegistry: EventHandlerRegistry;
  deviceRepository: DeviceRepository;
};

export type SubscribeHandler<Name extends DomainEventNames> = (event: DomainEvents[Name]) => Promise<void>;
