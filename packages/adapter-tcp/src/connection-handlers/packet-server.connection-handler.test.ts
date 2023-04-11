import { anything, capture, defer, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketMessage } from '../objects/packet.message';
import { PackerServerConnectionHandler } from './packet-server.connection-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionFactory } from '../factories/connection.factory';
import type { ConnectionDeviceUpdaterService } from '../services/connection-device-updater.service';
import type { PacketEventPublisherService } from '../services/packet-event-publisher.service';
import type { ConnectionRepository } from '@agnoc/domain';
import type { Packet, PacketServer, PacketSocket } from '@agnoc/transport-tcp';

describe('PackerServerConnectionHandler', function () {
  let connectionRepository: ConnectionRepository;
  let packetConnectionFactory: PacketConnectionFactory;
  let updateConnectionDeviceService: ConnectionDeviceUpdaterService;
  let packetEventPublisherService: PacketEventPublisherService;
  let handler: PackerServerConnectionHandler;
  let packetServer: PacketServer;
  let packetSocket: PacketSocket;
  let packetConnection: PacketConnection;
  let packet: Packet;

  beforeEach(function () {
    connectionRepository = imock();
    packetConnectionFactory = imock();
    updateConnectionDeviceService = imock();
    packetEventPublisherService = imock();
    handler = new PackerServerConnectionHandler(
      instance(connectionRepository),
      instance(packetConnectionFactory),
      instance(updateConnectionDeviceService),
      instance(packetEventPublisherService),
    );
    packetServer = imock();
    packetSocket = imock();
    packetConnection = imock();
    packet = imock();
  });

  describe('#addServers', function () {
    it('should register a server and listen for connections', function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenResolve(onClose);

      handler.register(instance(packetServer));

      verify(packetServer.on('connection', anything())).once();
      verify(packetServer.once('close')).once();
    });

    it('should handle connections', async function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenResolve(onClose);

      handler.register(instance(packetServer));

      when(packetConnectionFactory.create(anything())).thenReturn(instance(packetConnection));
      when(packetConnection.socket).thenReturn(instance(packetSocket));

      const [, onConnection] = capture<'connection', (socket: PacketSocket) => Promise<void>>(packetServer.on).first();

      await onConnection(instance(packetSocket));

      verify(connectionRepository.saveOne(instance(packetConnection))).once();
      verify(packetSocket.on('data', anything())).once();
      verify(packetSocket.once('close', anything())).once();
    });

    it('should close connections on server close', async function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenResolve(onClose);

      handler.register(instance(packetServer));

      when(packetConnectionFactory.create(anything())).thenReturn(instance(packetConnection));
      when(packetConnection.socket).thenReturn(instance(packetSocket));

      const [, onConnection] = capture<'connection', (socket: PacketSocket) => Promise<void>>(packetServer.on).first();

      await onConnection(instance(packetSocket));
      await onClose.resolve(undefined);

      verify(packetServer.off('connection', onConnection)).once();
      verify(packetConnection.close()).once();
    });

    it('should server close without connections', async function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenResolve(onClose);

      handler.register(instance(packetServer));

      await onClose.resolve(undefined);

      verify(packetConnection.close()).never();
    });

    it('should handle connection data', async function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenResolve(onClose);

      handler.register(instance(packetServer));

      when(packetConnectionFactory.create(anything())).thenReturn(instance(packetConnection));
      when(packetConnection.socket).thenReturn(instance(packetSocket));

      const [, onConnection] = capture<'connection', (socket: PacketSocket) => Promise<void>>(packetServer.on).first();

      await onConnection(instance(packetSocket));

      const [, onData] = capture<'data', (packet: Packet) => Promise<void>>(packetSocket.on).first();

      await onData(instance(packet));

      verify(updateConnectionDeviceService.updateFromPacket(instance(packet), instance(packetConnection))).once();

      const [packetMessage] = capture(packetEventPublisherService.publishPacketMessage).first();

      expect(packetMessage).to.be.instanceOf(PacketMessage);
      expect(packetMessage.packet).to.equal(instance(packet));
      expect(packetMessage.connection).to.equal(instance(packetConnection));
    });

    it('should handle connection close', async function () {
      const onClose = defer();

      when(packetServer.once(anything())).thenResolve(onClose);

      handler.register(instance(packetServer));

      when(packetConnectionFactory.create(anything())).thenReturn(instance(packetConnection));
      when(packetConnection.socket).thenReturn(instance(packetSocket));

      const [, onConnection] = capture<'connection', (socket: PacketSocket) => Promise<void>>(packetServer.on).first();

      await onConnection(instance(packetSocket));

      const [, onData] = capture<'data', (packet: Packet) => Promise<void>>(packetSocket.on).first();
      const [, onConnectionClose] = capture<'close', () => Promise<void>>(packetSocket.once).first();

      await onConnectionClose();

      verify(packetSocket.off('data', onData)).once();
      verify(connectionRepository.deleteOne(instance(packetConnection))).once();
    });
  });
});
