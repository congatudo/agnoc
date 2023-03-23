import { CommandBus, ConnectionRepository, DeviceRepository, DomainEventBus } from '@agnoc/domain';
import { EventHandlerRegistry, MemoryAdapter, TaskHandlerRegistry } from '@agnoc/toolkit';
import type { DomainEventNames, DomainEvents, Commands } from '@agnoc/domain';
import type { Server, TaskOutput } from '@agnoc/toolkit';

export class AgnocServer implements Server {
  private readonly domainEventBus: DomainEventBus;
  private readonly domainEventHandlerRegistry: EventHandlerRegistry;
  private readonly commandBus: CommandBus;
  private readonly commandHandlerRegistry: TaskHandlerRegistry<Commands>;
  private readonly deviceRepository: DeviceRepository;
  private readonly connectionRepository: ConnectionRepository;
  private readonly adapters = new Set<Server>();

  constructor() {
    this.domainEventBus = new DomainEventBus();
    this.domainEventHandlerRegistry = new EventHandlerRegistry(this.domainEventBus);
    this.commandBus = new CommandBus();
    this.commandHandlerRegistry = new TaskHandlerRegistry(this.commandBus);
    this.deviceRepository = new DeviceRepository(this.domainEventBus, new MemoryAdapter());
    this.connectionRepository = new ConnectionRepository(this.domainEventBus, new MemoryAdapter());
  }

  subscribe<Name extends DomainEventNames>(eventName: Name, handler: SubscribeHandler<Name>): void {
    this.domainEventBus.on(eventName, handler);
  }

  trigger<Command extends Commands[keyof Commands]>(command: Command): Promise<TaskOutput<Command>> {
    return this.commandBus.trigger(command);
  }

  buildAdapter(builder: AdapterFactory): void {
    const adapter = builder({
      domainEventHandlerRegistry: this.domainEventHandlerRegistry,
      commandHandlerRegistry: this.commandHandlerRegistry,
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
}

export interface AgnocServerListenOptions {
  host?: string;
}

type AdapterFactory = (container: Container) => Server;

export type Container = {
  domainEventHandlerRegistry: EventHandlerRegistry;
  commandHandlerRegistry: TaskHandlerRegistry<Commands>;
  deviceRepository: DeviceRepository;
  connectionRepository: ConnectionRepository;
};

export type SubscribeHandler<Name extends DomainEventNames> = (event: DomainEvents[Name]) => Promise<void>;
