import { imock, instance } from '@johanblumenberg/ts-mockito';
import { TCPServer } from './tcp.server';
import type { Commands, ConnectionRepository, DeviceRepository } from '@agnoc/domain';
import type { EventHandlerRegistry, TaskHandlerRegistry } from '@agnoc/toolkit';

describe('TCPServer', function () {
  let domainEventHandlerRegistry: EventHandlerRegistry;
  let commandHandlerRegistry: TaskHandlerRegistry<Commands>;
  let deviceRepository: DeviceRepository;
  let connectionRepository: ConnectionRepository;
  let tcpAdapter: TCPServer;

  beforeEach(function () {
    domainEventHandlerRegistry = imock();
    commandHandlerRegistry = imock();
    deviceRepository = imock();
    connectionRepository = imock();
    tcpAdapter = new TCPServer(
      instance(deviceRepository),
      instance(connectionRepository),
      instance(domainEventHandlerRegistry),
      instance(commandHandlerRegistry),
    );
  });

  it('should listen and close servers', async function () {
    await tcpAdapter.listen();
    await tcpAdapter.close();
  });

  it('should listen and close servers with custom ports', async function () {
    await tcpAdapter.listen({ host: '127.0.0.1', ports: { cmd: 0, map: 0, ntp: 0 } });
    await tcpAdapter.close();
  });
});
