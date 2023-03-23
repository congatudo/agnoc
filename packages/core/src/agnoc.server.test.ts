import { ConnectionRepository, DeviceRepository, LocateDeviceCommand } from '@agnoc/domain';
import { EventHandlerRegistry, ID, TaskHandlerRegistry } from '@agnoc/toolkit';
import { capture, fnmock, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { AgnocServer } from './agnoc.server';
import type { SubscribeHandler } from './agnoc.server';
import type { Device, DomainEventBus, DeviceLockedDomainEvent } from '@agnoc/domain';
import type { Server, TaskHandler } from '@agnoc/toolkit';

describe('AgnocServer', function () {
  let server: Server;
  let agnocServer: AgnocServer;

  beforeEach(function () {
    server = imock();
    agnocServer = new AgnocServer();
  });

  it('should provide a container to build an adapter', function () {
    agnocServer.buildAdapter((container) => {
      expect(container.deviceRepository).to.be.instanceOf(DeviceRepository);
      expect(container.connectionRepository).to.be.instanceOf(ConnectionRepository);
      expect(container.domainEventHandlerRegistry).to.be.instanceOf(EventHandlerRegistry);
      expect(container.commandHandlerRegistry).to.be.instanceOf(TaskHandlerRegistry);

      return instance(server);
    });
  });

  it('should listen adapters', async function () {
    const options = { host: '127.0.0.1' };

    agnocServer.buildAdapter(() => {
      return instance(server);
    });

    await agnocServer.listen(options);

    verify(server.listen(options)).once();
  });

  it('should close adapters', async function () {
    agnocServer.buildAdapter(() => {
      return instance(server);
    });

    await agnocServer.close();

    verify(server.close()).once();
  });

  it('should subscribe to domain events', async function () {
    const device: Device = imock();
    const event: DeviceLockedDomainEvent = imock();
    const handler: SubscribeHandler<'DeviceLockedDomainEvent'> = fnmock();

    agnocServer.subscribe('DeviceLockedDomainEvent', instance(handler));

    agnocServer.buildAdapter(({ deviceRepository }) => {
      void deviceRepository.saveOne(instance(device));

      return instance(server);
    });

    // Extract the eventBus from the `device.publishEvents` method.
    // This is just a way to obtain the eventBus to manually publish events.
    const args = capture(device.publishEvents).first();
    const eventBus = args[0] as DomainEventBus;

    await eventBus.emit('DeviceLockedDomainEvent', instance(event));

    verify(handler(instance(event))).once();
  });

  it('should trigger commands', async function () {
    const taskHandler: TaskHandler = imock();
    const command = new LocateDeviceCommand({ deviceId: new ID(1) });

    when(taskHandler.forName).thenReturn('LocateDeviceCommand');

    agnocServer.buildAdapter(({ commandHandlerRegistry }) => {
      commandHandlerRegistry.register(instance(taskHandler));

      return instance(server);
    });

    await agnocServer.trigger(command);

    verify(taskHandler.handle(command)).once();
  });
});
