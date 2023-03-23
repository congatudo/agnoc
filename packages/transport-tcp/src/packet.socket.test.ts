import { Server, Socket } from 'net';
import { Duplex } from 'stream';
import { setTimeout } from 'timers/promises';
import { DomainException } from '@agnoc/toolkit';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketSocket } from './packet.socket';
import { givenSomePacketProps } from './test-support';
import { Packet } from './value-objects/packet.value-object';
import type { PacketMapper } from './mappers/packet.mapper';
import type { AddressInfo } from 'net';

describe('PacketSocket', function () {
  let packetMapper: PacketMapper;
  let packetSocket: PacketSocket;
  let server: Server;

  beforeEach(function () {
    packetMapper = imock();
    packetSocket = new PacketSocket(instance(packetMapper));
    server = new Server();
  });

  afterEach(function (done) {
    if (server.listening) {
      server.close(done);
    } else {
      done();
    }
  });

  it('should be a duplex stream', function () {
    expect(packetSocket).to.be.an.instanceof(Duplex);
    expect(packetSocket.localAddress).to.be.undefined;
    expect(packetSocket.localPort).to.be.undefined;
    expect(packetSocket.remoteAddress).to.be.undefined;
    expect(packetSocket.remotePort).to.be.undefined;
    expect(packetSocket.toString()).to.be.equal('unknown:0::unknown:0');
    expect(packetSocket.connecting).to.be.false;
    expect(packetSocket.connected).to.be.false;
  });

  it('should connect to a server', function (done) {
    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);

      expect(packetSocket.connecting).to.be.true;
      expect(packetSocket.connected).to.be.false;
    });

    packetSocket.once('connect', () => {
      expect(packetSocket.localAddress).to.be.a('string');
      expect(packetSocket.localPort).to.be.a('number');
      expect(packetSocket.remoteAddress).to.be.a('string');
      expect(packetSocket.remotePort).to.be.a('number');
      expect(packetSocket.toString()).to.be.not.equal('unknown:0::unknown:0');
      expect(packetSocket.connecting).to.be.false;
      expect(packetSocket.connected).to.be.true;
      void packetSocket.end();
    });

    packetSocket.once('end', done);

    server.listen(0);
  });

  it('should write packets', function (done) {
    const buffer = givenAPacketBuffer();
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.fromDomain(anything())).thenReturn(buffer);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', (socket) => {
      socket.once('data', (data) => {
        expect(Buffer.compare(data, buffer)).to.be.equal(0);
        verify(packetMapper.fromDomain(packet)).once();
        done();
      });
    });

    packetSocket.once('connect', () => {
      void packetSocket.end(packet);
    });

    server.listen(0);
  });

  it('should read packets', function (done) {
    const buffer = givenAPacketBuffer();
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', (socket) => {
      socket.end(buffer);
    });

    packetSocket.once('data', (data) => {
      expect(data).to.be.equal(packet);
      done();
    });

    server.listen(0);
  });

  it('should emit an error when packet length is too big', function (done) {
    const buffer = Buffer.from('ffffffff');

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', (socket) => {
      socket.end(buffer);
    });

    packetSocket.once('error', (error) => {
      expect(error).to.be.an.instanceOf(DomainException);
      expect(error.message).to.be.equal('Packet max length exceeded');
      done();
    });

    server.listen(0);
  });

  it('should not try to read when is not connected', function () {
    const ret = packetSocket.read() as Buffer;

    expect(ret).to.be.null;
  });

  it('should not try to write when is not connected', function (done) {
    const packet = new Packet(givenSomePacketProps());

    packetSocket.once('error', (error) => {
      expect(error).to.be.an.instanceOf(DomainException);
      expect(error.message).to.be.equal('Socket is not connected');
      done();
    });

    void packetSocket.write(packet);
  });

  it('should not try to end when is not connected', function (done) {
    packetSocket.once('error', (error) => {
      expect(error).to.be.an.instanceOf(DomainException);
      expect(error.message).to.be.equal('Socket is not connected');
      done();
    });

    void packetSocket.end();
  });

  it('should throw an error when unable to map the packet', function (done) {
    const buffer = givenAPacketBuffer();
    const error = new Error('unexpected error');

    when(packetMapper.toDomain(anything())).thenThrow(error);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', (socket) => {
      socket.end(buffer);
    });

    packetSocket.once('error', (error) => {
      expect(error).to.be.equal(error);
      done();
    });

    server.listen(0);
  });

  it('should be able to read partial packets', function (done) {
    const buffer = givenAPacketBuffer();
    const chunkA = buffer.subarray(0, 4);
    const chunkB = buffer.subarray(4);
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.toDomain(anything())).thenReturn(packet);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', async (socket) => {
      socket.write(chunkA);

      await setTimeout(100);

      socket.end(chunkB);
    });

    packetSocket.once('data', (data) => {
      expect(data).to.be.equal(packet);
      done();
    });

    server.listen(0);
  });

  it('should wrap an existing connected socket', function (done) {
    const buffer = givenAPacketBuffer();
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.fromDomain(anything())).thenReturn(buffer);
    when(packetMapper.toDomain(anything())).thenReturn(packet);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', (socket) => {
      const packetSocketServer = new PacketSocket(instance(packetMapper), socket);

      expect(packetSocketServer.localAddress).to.be.a('string');
      expect(packetSocketServer.localPort).to.be.a('number');
      expect(packetSocketServer.remoteAddress).to.be.a('string');
      expect(packetSocketServer.remotePort).to.be.a('number');
      expect(packetSocketServer.toString()).to.be.not.equal('unknown:0::unknown:0');
      expect(packetSocketServer.connecting).to.be.false;
      expect(packetSocketServer.connected).to.be.true;

      void packetSocketServer.end(packet);
    });

    packetSocket.once('data', (data) => {
      expect(data).to.be.equal(packet);
      done();
    });

    server.listen(0);
  });

  it('should wrap an existing socket', function () {
    packetSocket = new PacketSocket(instance(packetMapper), new Socket());

    expect(packetSocket.localAddress).to.be.undefined;
    expect(packetSocket.localPort).to.be.undefined;
    expect(packetSocket.remoteAddress).to.be.undefined;
    expect(packetSocket.remotePort).to.be.undefined;
    expect(packetSocket.toString()).to.be.equal('unknown:0::unknown:0');
    expect(packetSocket.connecting).to.be.false;
    expect(packetSocket.connected).to.be.false;
  });

  describe('#connect()', function () {
    it('should connect to a server by options', function (done) {
      server.once('listening', () => {
        const address = server.address() as AddressInfo;

        void packetSocket.connect({ port: address.port });
      });

      packetSocket.once('connect', () => {
        void packetSocket.end();
      });

      packetSocket.once('end', done);

      server.listen(0);
    });

    it('should connect to a server by port', function (done) {
      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      packetSocket.once('connect', () => {
        void packetSocket.end();
      });

      packetSocket.once('end', done);

      server.listen(0);
    });

    it('should connect to a server by host and port', function (done) {
      server.once('listening', () => {
        const address = server.address() as AddressInfo;

        void packetSocket.connect(address.port, address.address);
      });

      packetSocket.once('connect', () => {
        void packetSocket.end();
      });

      packetSocket.once('end', done);

      server.listen(0);
    });

    it('should throw an error when the socket is already connected', function (done) {
      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      packetSocket.once('connect', async () => {
        await expect(packetSocket.connect((server.address() as AddressInfo).port)).to.be.rejectedWith(
          DomainException,
          'Socket is already connected',
        );

        await packetSocket.end();

        done();
      });

      server.listen(0);
    });
  });

  describe('#write()', function () {
    it('should write packets with encoding and callback', function (done) {
      const buffer = givenAPacketBuffer();
      const packet = new Packet(givenSomePacketProps());

      when(packetMapper.fromDomain(anything())).thenReturn(buffer);

      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      server.once('connection', (socket) => {
        socket.once('data', (data) => {
          expect(Buffer.compare(data, buffer)).to.be.equal(0);
          verify(packetMapper.fromDomain(packet)).once();
          socket.end();
        });
      });

      packetSocket.once('connect', () => {
        packetSocket.write(packet, 'utf8', done);
      });

      server.listen(0);
    });

    it('should write packets with callback', function (done) {
      const buffer = givenAPacketBuffer();
      const packet = new Packet(givenSomePacketProps());

      when(packetMapper.fromDomain(anything())).thenReturn(buffer);

      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      server.once('connection', (socket) => {
        socket.once('data', (data) => {
          expect(Buffer.compare(data, buffer)).to.be.equal(0);
          verify(packetMapper.fromDomain(packet)).once();
          socket.end();
        });
      });

      packetSocket.once('connect', () => {
        packetSocket.write(packet, done);
      });

      server.listen(0);
    });

    it('should write packets as a promise', function (done) {
      const buffer = givenAPacketBuffer();
      const packet = new Packet(givenSomePacketProps());

      when(packetMapper.fromDomain(anything())).thenReturn(buffer);

      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      server.once('connection', (socket) => {
        socket.once('data', (data) => {
          expect(Buffer.compare(data, buffer)).to.be.equal(0);
          verify(packetMapper.fromDomain(packet)).once();
          socket.end();
        });
      });

      packetSocket.once('connect', async () => {
        await packetSocket.write(packet);
        done();
      });

      server.listen(0);
    });

    it('should reject the write when it fails', function (done) {
      const packet = new Packet(givenSomePacketProps());

      packetSocket.once('error', () => {
        // noop
      });

      packetSocket.write(packet).catch((error) => {
        expect(error).to.be.an.instanceOf(DomainException);
        expect((error as Error).message).to.be.equal('Socket is not connected');
        done();
      });
    });
  });

  describe('#end()', function () {
    it('should end socket with packet and callback', function (done) {
      const buffer = givenAPacketBuffer();
      const packet = new Packet(givenSomePacketProps());

      when(packetMapper.fromDomain(anything())).thenReturn(buffer);

      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      server.once('connection', (socket) => {
        socket.once('data', (data) => {
          expect(Buffer.compare(data, buffer)).to.be.equal(0);
          verify(packetMapper.fromDomain(packet)).once();
          socket.end();
        });
      });

      packetSocket.once('connect', () => {
        packetSocket.end(packet, done);
      });

      server.listen(0);
    });

    it('should end socket with callback', function (done) {
      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      packetSocket.once('connect', () => {
        packetSocket.end(done);
      });

      server.listen(0);
    });

    it('should end socket with packet as a promise', function (done) {
      const buffer = givenAPacketBuffer();
      const packet = new Packet(givenSomePacketProps());

      when(packetMapper.fromDomain(anything())).thenReturn(buffer);

      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      server.once('connection', (socket) => {
        socket.once('data', (data) => {
          expect(Buffer.compare(data, buffer)).to.be.equal(0);
          verify(packetMapper.fromDomain(packet)).once();
          socket.end();
        });
      });

      packetSocket.once('connect', async () => {
        await packetSocket.end(packet);
        done();
      });

      server.listen(0);
    });

    it('should end socket as a promise', function (done) {
      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      packetSocket.once('connect', async () => {
        await packetSocket.end();
        done();
      });

      server.listen(0);
    });
  });
});

function givenAPacketBuffer() {
  return Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');
}
