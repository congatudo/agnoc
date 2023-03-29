import { Socket, Server } from 'net';
import { Connection, Device } from '@agnoc/domain';
import { givenSomeDeviceProps } from '@agnoc/domain/test-support';
import { ArgumentInvalidException, ArgumentNotProvidedException, DomainException, ID } from '@agnoc/toolkit';
import { Packet, PacketSocket } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, deepEqual, defer, imock, instance, spy, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketConnection } from './packet-connection.aggregate-root';
import type { PacketEventBus } from '../event-buses/packet.event-bus';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketFactory, PacketMapper } from '@agnoc/transport-tcp';
import type { AddressInfo } from 'net';

describe('PacketConnection', function () {
  let packetFactory: PacketFactory;
  let eventBus: PacketEventBus;
  let packetMapper: PacketMapper;
  let packetSocket: PacketSocket;
  let packetSocketSpy: PacketSocket;
  let packetMessage: PacketMessage;
  let socket: Socket;
  let server: Server;

  beforeEach(function () {
    server = new Server();
    socket = new Socket();
    packetFactory = imock();
    eventBus = imock();
    packetMapper = imock();
    packetMessage = imock();
    packetSocket = new PacketSocket(instance(packetMapper), socket);
    packetSocketSpy = spy(packetSocket);
  });

  it('should be created', function () {
    const props = { id: ID.generate(), socket: packetSocket };
    const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);

    expect(connection).to.be.instanceOf(Connection);
    expect(connection.id).to.be.equal(props.id);
    expect(connection.socket).to.be.equal(props.socket);
    expect(connection.connectionType).to.be.equal('PACKET');
    expect(PacketConnection.isPacketConnection(connection)).to.be.true;
  });

  it("should throw an error when 'socket' is not provided", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new PacketConnection(instance(packetFactory), instance(eventBus), { id: ID.generate(), socket: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'socket' for PacketConnection not provided`);
  });

  it("should throw an error when 'socket' is not a PacketSocket", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new PacketConnection(instance(packetFactory), instance(eventBus), { id: ID.generate(), socket: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'socket' of PacketConnection is not an instance of PacketSocket`,
    );
  });

  describe('#send()', function () {
    it('should do nothing', async function () {
      const props = { id: ID.generate(), socket: packetSocket };
      const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
      const packet = new Packet(givenSomePacketProps());
      const data = { result: 0, body: { deviceTime: 1 } };

      when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);

      await expect(connection.send('DEVICE_GETTIME_RSP', data)).to.be.rejectedWith(
        DomainException,
        'Unable to send packet through a closed connection',
      );

      verify(packetFactory.create(anything(), anything(), anything())).never();
      verify(packetSocketSpy.write(anything())).never();
    });
  });

  describe('#respond()', function () {
    it('should do nothing', async function () {
      const props = { id: ID.generate(), socket: packetSocket };
      const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
      const packet = new Packet(givenSomePacketProps());
      const anotherPacket = new Packet(givenSomePacketProps());
      const data = { result: 0, body: { deviceTime: 1 } };

      when(packetFactory.create(anything(), anything(), anything())).thenReturn(anotherPacket);

      await expect(connection.respond('DEVICE_GETTIME_RSP', data, packet)).to.be.rejectedWith(
        DomainException,
        'Unable to send packet through a closed connection',
      );

      verify(packetFactory.create(anything(), anything(), anything())).never();
      verify(packetSocketSpy.write(anything())).never();
    });
  });

  describe('#sendAndWait()', function () {
    it('should do nothing', async function () {
      const props = { id: ID.generate(), socket: packetSocket };
      const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
      const packet = new Packet(givenSomePacketProps());
      const data = { result: 0, body: { deviceTime: 1 } };

      when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);

      await expect(connection.sendAndWait('DEVICE_GETTIME_RSP', data)).to.be.rejectedWith(
        DomainException,
        'Unable to send packet through a closed connection',
      );

      verify(packetFactory.create(anything(), anything(), anything())).never();
      verify(packetSocketSpy.write(anything())).never();
    });
  });

  describe('#respondAndWait()', function () {
    it('should do nothing', async function () {
      const props = { id: ID.generate(), socket: packetSocket };
      const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
      const packet = new Packet(givenSomePacketProps());
      const data = { result: 0, body: { deviceTime: 1 } };

      when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);

      await expect(connection.respondAndWait('DEVICE_GETTIME_RSP', data, packet)).to.be.rejectedWith(
        DomainException,
        'Unable to send packet through a closed connection',
      );

      verify(packetFactory.create(anything(), anything(), anything())).never();
      verify(packetSocketSpy.write(anything())).never();
    });
  });

  describe('#close()', function () {
    it('should do nothing', async function () {
      const props = { id: ID.generate(), socket: packetSocket };
      const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);

      await connection.close();

      verify(packetSocketSpy.end()).never();
    });
  });

  describe('with socket connected', function () {
    beforeEach(function (done) {
      server.listen(0, () => {
        socket.connect((server.address() as AddressInfo).port, done);
      });
    });

    afterEach(function (done) {
      if (socket.readyState === 'open') {
        socket.end();
      }

      if (server.listening) {
        server.close(done);
      } else {
        done();
      }
    });

    describe('#send()', function () {
      it('should send a packet', async function () {
        const props = { id: ID.generate(), socket: packetSocket };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
        const packet = new Packet(givenSomePacketProps());
        const data = { result: 0, body: { deviceTime: 1 } };

        when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);
        when(packetMapper.fromDomain(anything())).thenReturn(Buffer.alloc(0));

        await connection.send('DEVICE_GETTIME_RSP', data);

        verify(
          packetFactory.create('DEVICE_GETTIME_RSP', data, deepEqual({ deviceId: new ID(0), userId: new ID(0) })),
        ).once();
        verify(packetSocketSpy.write(packet)).once();
      });

      it('should send a packet with a device attached', async function () {
        const device = new Device(givenSomeDeviceProps());
        const props = { id: ID.generate(), socket: packetSocket, device };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
        const packet = new Packet(givenSomePacketProps());
        const data = { result: 0, body: { deviceTime: 1 } };

        when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);
        when(packetMapper.fromDomain(anything())).thenReturn(Buffer.alloc(0));

        await connection.send('DEVICE_GETTIME_RSP', data);

        verify(
          packetFactory.create('DEVICE_GETTIME_RSP', data, deepEqual({ deviceId: device.id, userId: device.userId })),
        ).once();
        verify(packetSocketSpy.write(packet)).once();
      });
    });

    describe('#respond()', function () {
      it('should respond with a packet', async function () {
        const props = { id: ID.generate(), socket: packetSocket };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
        const packet = new Packet(givenSomePacketProps());
        const anotherPacket = new Packet(givenSomePacketProps());
        const data = { result: 0, body: { deviceTime: 1 } };

        when(packetFactory.create(anything(), anything(), anything())).thenReturn(anotherPacket);
        when(packetMapper.fromDomain(anything())).thenReturn(Buffer.alloc(0));

        await connection.respond('DEVICE_GETTIME_RSP', data, packet);

        verify(packetFactory.create('DEVICE_GETTIME_RSP', data, packet)).once();
        verify(packetSocketSpy.write(anotherPacket)).once();
      });
    });

    describe('#sendAndWait()', function () {
      it('should send a packet and wait for the response', function (done) {
        const props = { id: ID.generate(), socket: packetSocket };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
        const packet = new Packet(givenSomePacketProps());
        const data = { result: 0, body: { deviceTime: 1 } };
        const eventPromise = defer<PacketMessage>();

        when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);
        when(packetMapper.fromDomain(anything())).thenReturn(Buffer.alloc(0));
        when(eventBus.once(anything())).thenReturn(eventPromise);

        void connection.sendAndWait('DEVICE_GETTIME_RSP', data).then((ret) => {
          expect(ret).to.be.equal(instance(packetMessage));

          verify(
            packetFactory.create('DEVICE_GETTIME_RSP', data, deepEqual({ deviceId: new ID(0), userId: new ID(0) })),
          ).once();
          verify(packetSocketSpy.write(packet)).once();
          verify(eventBus.once(packet.sequence.toString())).once();
          done();
        });

        void eventPromise.resolve(instance(packetMessage));
      });

      it('should send a packet with a device attached and wait for the response', function (done) {
        const device = new Device(givenSomeDeviceProps());
        const props = { id: ID.generate(), socket: packetSocket, device };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
        const packet = new Packet(givenSomePacketProps());
        const data = { result: 0, body: { deviceTime: 1 } };
        const eventPromise = defer<PacketMessage>();

        when(packetFactory.create(anything(), anything(), anything())).thenReturn(packet);
        when(packetMapper.fromDomain(anything())).thenReturn(Buffer.alloc(0));
        when(eventBus.once(anything())).thenReturn(eventPromise);

        void connection.sendAndWait('DEVICE_GETTIME_RSP', data).then((ret) => {
          expect(ret).to.be.equal(instance(packetMessage));

          verify(
            packetFactory.create('DEVICE_GETTIME_RSP', data, deepEqual({ deviceId: device.id, userId: device.userId })),
          ).once();
          verify(packetSocketSpy.write(packet)).once();
          verify(eventBus.once(packet.sequence.toString())).once();
          done();
        });

        void eventPromise.resolve(instance(packetMessage));
      });
    });

    describe('#respondAndWait()', function () {
      it('should respond to a packet and wait for the response', function (done) {
        const props = { id: ID.generate(), socket: packetSocket };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);
        const packet = new Packet(givenSomePacketProps());
        const anotherPacket = new Packet(givenSomePacketProps());
        const data = { result: 0, body: { deviceTime: 1 } };
        const eventPromise = defer<PacketMessage>();

        when(packetFactory.create(anything(), anything(), anything())).thenReturn(anotherPacket);
        when(packetMapper.fromDomain(anything())).thenReturn(Buffer.alloc(0));
        when(eventBus.once(anything())).thenReturn(eventPromise);

        void connection.respondAndWait('DEVICE_GETTIME_RSP', data, packet).then((ret) => {
          expect(ret).to.be.equal(instance(packetMessage));

          verify(packetFactory.create('DEVICE_GETTIME_RSP', data, packet)).once();
          verify(packetSocketSpy.write(anotherPacket)).once();
          verify(eventBus.once(packet.sequence.toString())).once();
          done();
        });

        void eventPromise.resolve(instance(packetMessage));
      });
    });

    describe('#close()', function () {
      it('should close the socket', async function () {
        const props = { id: ID.generate(), socket: packetSocket };
        const connection = new PacketConnection(instance(packetFactory), instance(eventBus), props);

        await connection.close();

        verify(packetSocketSpy.end()).once();
      });
    });
  });
});
