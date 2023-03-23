/* eslint-disable import/no-extraneous-dependencies */
import { once } from 'events';
import { CommandQueryBus, ConnectionRepository, Device, DeviceRepository, DomainEventBus } from '@agnoc/domain';
import { givenSomeDeviceProps } from '@agnoc/domain/test-support';
import { EventHandlerRegistry, ID, MemoryAdapter, TaskHandlerRegistry } from '@agnoc/toolkit';
import {
  getCustomDecoders,
  getProtobufRoot,
  PacketFactory,
  PacketMapper,
  PacketSocket,
  PayloadMapper,
  PayloadObjectParserService,
} from '@agnoc/transport-tcp';
import { expect } from 'chai';
import { TCPServer } from '@agnoc/adapter-tcp';
import type { TCPAdapterListenOptions } from '@agnoc/adapter-tcp';
import type { CommandsOrQueries } from '@agnoc/domain';
import type { ICLIENT_ONLINE_REQ, IDEVICE_REGISTER_REQ } from '@agnoc/schemas-tcp';
import type { CreatePacketProps, Packet } from '@agnoc/transport-tcp';

describe('Integration', function () {
  let domainEventBus: DomainEventBus;
  let commandBus: CommandQueryBus;
  let domainEventHandlerRegistry: EventHandlerRegistry;
  let commandHandlerRegistry: TaskHandlerRegistry<CommandsOrQueries>;
  let deviceRepository: DeviceRepository;
  let connectionRepository: ConnectionRepository;
  let tcpAdapter: TCPServer;
  let packetSocket: PacketSocket;
  let secondPacketSocket: PacketSocket;
  let packetFactory: PacketFactory;

  beforeEach(function () {
    // Server blocks
    domainEventBus = new DomainEventBus();
    commandBus = new CommandQueryBus();

    domainEventHandlerRegistry = new EventHandlerRegistry(domainEventBus);
    commandHandlerRegistry = new TaskHandlerRegistry(commandBus);
    deviceRepository = new DeviceRepository(domainEventBus, new MemoryAdapter());
    connectionRepository = new ConnectionRepository(domainEventBus, new MemoryAdapter());
    tcpAdapter = new TCPServer(
      deviceRepository,
      connectionRepository,
      domainEventHandlerRegistry,
      commandHandlerRegistry,
    );

    // Client blocks
    const payloadMapper = new PayloadMapper(new PayloadObjectParserService(getProtobufRoot(), getCustomDecoders()));
    const packetMapper = new PacketMapper(payloadMapper);

    packetSocket = new PacketSocket(packetMapper);
    secondPacketSocket = new PacketSocket(packetMapper);
    packetFactory = new PacketFactory();
  });

  afterEach(async function () {
    await tcpAdapter.close();
  });

  describe('packet validation', function () {
    it('should handle heartbeat packets on cmd server', async function () {
      const createPacketProps = givenSomeCreatePacketProps();
      const sentPacket = packetFactory.create('CLIENT_HEARTBEAT_REQ', {}, createPacketProps);
      const { ports } = await tcpAdapter.listen(givenSomeServerPorts());

      await packetSocket.connect(ports.cmd);

      void packetSocket.write(sentPacket);

      const [receivedPacket] = (await once(packetSocket, 'data')) as Packet[];

      expect(receivedPacket).to.exist;
      expect(receivedPacket.ctype).to.be.equal(sentPacket.ctype);
      expect(receivedPacket.sequence.equals(sentPacket.sequence)).to.be.true;
      expect(receivedPacket.flow).to.be.equal(1);
      expect(receivedPacket.deviceId.equals(sentPacket.deviceId)).to.be.true;
      expect(receivedPacket.userId.equals(sentPacket.userId)).to.be.true;
      expect(receivedPacket.payload.opcode.value).to.be.equal('CLIENT_HEARTBEAT_RSP');
      expect(receivedPacket.payload.object).to.be.deep.equal({});
    });

    it('should handle heartbeat packets on map server', async function () {
      const createPacketProps = givenSomeCreatePacketProps();
      const sentPacket = packetFactory.create('CLIENT_HEARTBEAT_REQ', {}, createPacketProps);
      const { ports } = await tcpAdapter.listen(givenSomeServerPorts());

      await packetSocket.connect(ports.map);

      void packetSocket.write(sentPacket);

      const [receivedPacket] = (await once(packetSocket, 'data')) as Packet[];

      expect(receivedPacket).to.exist;
      expect(receivedPacket.ctype).to.be.equal(sentPacket.ctype);
      expect(receivedPacket.sequence.equals(sentPacket.sequence)).to.be.true;
      expect(receivedPacket.flow).to.be.equal(1);
      expect(receivedPacket.deviceId.equals(sentPacket.deviceId)).to.be.true;
      expect(receivedPacket.userId.equals(sentPacket.userId)).to.be.true;
      expect(receivedPacket.payload.opcode.value).to.be.equal('CLIENT_HEARTBEAT_RSP');
      expect(receivedPacket.payload.object).to.be.deep.equal({});
    });

    it('should handle ntp connections', async function () {
      const { ports } = await tcpAdapter.listen(givenSomeServerPorts());
      const now = Math.floor(Date.now() / 1000);

      await packetSocket.connect(ports.ntp);

      const [receivedPacket] = (await once(packetSocket, 'data')) as Packet<'DEVICE_TIME_SYNC_RSP'>[];

      expect(receivedPacket).to.exist;
      expect(receivedPacket.ctype).to.be.equal(2);
      expect(receivedPacket.flow).to.be.equal(0);
      expect(receivedPacket.deviceId.value).to.be.equal(0);
      expect(receivedPacket.userId.value).to.be.equal(0);
      expect(receivedPacket.payload.opcode.value).to.be.equal('DEVICE_TIME_SYNC_RSP');
      expect(receivedPacket.payload.object.result).to.be.equal(0);
      expect(receivedPacket.payload.object.body.time).to.be.greaterThanOrEqual(now);
    });
  });

  describe('flow validation', function () {
    it('should handle a device registration', async function () {
      const { ports } = await tcpAdapter.listen(givenSomeServerPorts());

      await packetSocket.connect(ports.cmd);

      void packetSocket.write(
        packetFactory.create('DEVICE_REGISTER_REQ', givenADeviceRegisterRequest(), givenSomeCreatePacketProps()),
      );

      const [receivedPacket] = (await once(packetSocket, 'data')) as Packet<'DEVICE_REGISTER_RSP'>[];

      expect(receivedPacket.payload.opcode.value).to.be.equal('DEVICE_REGISTER_RSP');

      const device = await deviceRepository.findOneById(new ID(receivedPacket.payload.object.device.id));

      expect(device).to.exist;
    });

    it('should handle a device connection', async function () {
      const device = new Device(givenSomeDeviceProps());
      let receivedPacket: Packet;
      let secondReceivedPacket: Packet;

      await deviceRepository.saveOne(device);

      const { ports } = await tcpAdapter.listen(givenSomeServerPorts());

      await packetSocket.connect(ports.cmd);

      void packetSocket.write(
        packetFactory.create('CLIENT_ONLINE_REQ', givenAClientOnlineRequest(), givenSomeCreatePacketProps(device)),
      );

      [receivedPacket] = (await once(packetSocket, 'data')) as Packet<'CLIENT_ONLINE_RSP'>[];

      expect(receivedPacket.payload.opcode.value).to.be.equal('CLIENT_ONLINE_RSP');

      await secondPacketSocket.connect(ports.map);

      void secondPacketSocket.write(
        packetFactory.create('CLIENT_HEARTBEAT_REQ', givenAClientOnlineRequest(), givenSomeCreatePacketProps(device)),
      );

      // The device already has two identified connections and
      // the device should be marked as connected.
      // eslint-disable-next-line prefer-const
      [, [receivedPacket], [secondReceivedPacket]] = await Promise.all([
        domainEventBus.once('DeviceConnectedDomainEvent'),
        once(packetSocket, 'data') as Promise<Packet<'DEVICE_CONTROL_LOCK_REQ'>[]>,
        once(secondPacketSocket, 'data') as Promise<Packet<'CLIENT_HEARTBEAT_RSP'>[]>,
      ]);

      expect(device.isConnected).to.be.true;
      expect(receivedPacket.payload.opcode.value).to.be.equal('DEVICE_CONTROL_LOCK_REQ');
      expect(secondReceivedPacket.payload.opcode.value).to.be.equal('CLIENT_HEARTBEAT_RSP');

      void packetSocket.write(
        packetFactory.create('DEVICE_CONTROL_LOCK_RSP', { result: 0 }, givenSomeCreatePacketProps(device)),
      );

      // The device should be marked as locked.
      await domainEventBus.once('DeviceLockedDomainEvent');

      expect(device.isLocked).to.be.true;
    });
  });
});

function givenSomeServerPorts(): TCPAdapterListenOptions {
  return {
    ports: {
      cmd: 0,
      map: 0,
      ntp: 0,
    },
  };
}

function givenADeviceRegisterRequest(): IDEVICE_REGISTER_REQ {
  return {
    softwareVersion: 'S2.1.40.30.01R',
    hardwareVersion: '1.0.1',
    deviceSerialNumber: '1234567890',
    deviceMac: '00:00:00:00:00:00',
    deviceType: 9,
    customerFirmwareId: 1003,
    ctrlVersion: 'V4.0',
  };
}

function givenAClientOnlineRequest(): ICLIENT_ONLINE_REQ {
  return {
    deviceSerialNumber: '1234567890',
    unk1: false,
    unk2: 0,
  };
}

function givenSomeCreatePacketProps(device?: Device): CreatePacketProps {
  // This properties should be inverted given that we are the client.
  return {
    deviceId: device?.userId ?? new ID(0),
    userId: device?.id ?? new ID(0),
  };
}
