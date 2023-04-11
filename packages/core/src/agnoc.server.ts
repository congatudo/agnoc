import { CommandQueryBus, ConnectionRepository, DeviceRepository, DomainEventBus } from '@agnoc/domain';
import { EventHandlerRegistry, MemoryAdapter, TaskHandlerRegistry } from '@agnoc/toolkit';
import { FindDeviceQueryHandler } from './query-handlers/find-device.query-handler';
import { FindDevicesQueryHandler } from './query-handlers/find-devices.query-handler';
import type { DomainEventNames, DomainEvents, CommandsOrQueries } from '@agnoc/domain';
import type { Server, TaskOutput } from '@agnoc/toolkit';

export class AgnocServer implements Server {
  private readonly domainEventBus: DomainEventBus;
  private readonly domainEventHandlerRegistry: EventHandlerRegistry;
  private readonly commandQueryBus: CommandQueryBus;
  private readonly commandQueryHandlerRegistry: TaskHandlerRegistry<CommandsOrQueries>;
  private readonly deviceRepository: DeviceRepository;
  private readonly connectionRepository: ConnectionRepository;
  private readonly adapters = new Set<Server>();

  constructor() {
    this.domainEventBus = new DomainEventBus();
    this.domainEventHandlerRegistry = new EventHandlerRegistry(this.domainEventBus);
    this.commandQueryBus = new CommandQueryBus();
    this.commandQueryHandlerRegistry = new TaskHandlerRegistry(this.commandQueryBus);
    this.deviceRepository = new DeviceRepository(this.domainEventBus, new MemoryAdapter());
    this.connectionRepository = new ConnectionRepository(this.domainEventBus, new MemoryAdapter());
    this.registerHandlers();
  }

  subscribe<Name extends DomainEventNames>(eventName: Name, handler: SubscribeHandler<Name>): void {
    this.domainEventBus.on(eventName, handler);
  }

  trigger<CommandOrQuery extends CommandsOrQueries[keyof CommandsOrQueries]>(
    command: CommandOrQuery,
  ): Promise<TaskOutput<CommandOrQuery>> {
    return this.commandQueryBus.trigger(command);
  }

  buildAdapter(builder: AdapterFactory): void {
    const adapter = builder({
      domainEventHandlerRegistry: this.domainEventHandlerRegistry,
      commandQueryHandlerRegistry: this.commandQueryHandlerRegistry,
      deviceRepository: this.deviceRepository,
      connectionRepository: this.connectionRepository,
    });

    this.adapters.add(adapter);
  }

  async listen(options?: AgnocServerListenOptions): Promise<void> {
    await Promise.all([...this.adapters].map((adapter) => adapter.listen(options)));
  }

  async close(): Promise<void> {
    await Promise.all([...this.adapters].map((adapter) => adapter.close()));
  }

  private registerHandlers(): void {
    this.commandQueryHandlerRegistry.register(
      new FindDeviceQueryHandler(this.deviceRepository),
      new FindDevicesQueryHandler(this.deviceRepository),
    );
  }
}

export interface AgnocServerListenOptions {
  host?: string;
}

type AdapterFactory = (container: Container) => Server;

export type Container = {
  domainEventHandlerRegistry: EventHandlerRegistry;
  commandQueryHandlerRegistry: TaskHandlerRegistry<CommandsOrQueries>;
  deviceRepository: DeviceRepository;
  connectionRepository: ConnectionRepository;
};

export type SubscribeHandler<Name extends DomainEventNames> = (event: DomainEvents[Name]) => Promise<void>;
