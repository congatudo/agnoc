import { Server } from 'net';
import { Duplex } from 'stream';
import { setTimeout } from 'timers/promises';
import { DomainException } from '@agnoc/toolkit';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { givenSomePacketProps } from '../test-support';
import { Packet } from '../value-objects/packet.value-object';
import { PacketSocket } from './packet.socket';
import type { PacketMapper } from '../mappers/packet.mapper';
import type { AddressInfo } from 'net';

describe('packet.socket', () => {
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
  });

  it('should connect to a server', function (done) {
    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);

      expect(packetSocket.connecting).to.be.true;
    });

    packetSocket.once('connect', () => {
      expect(packetSocket.localAddress).to.be.a('string');
      expect(packetSocket.localPort).to.be.a('number');
      expect(packetSocket.remoteAddress).to.be.a('string');
      expect(packetSocket.remotePort).to.be.a('number');
      expect(packetSocket.connecting).to.be.false;
      packetSocket.end();
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
      packetSocket.end(packet);
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

    packetSocket.write(packet);
  });

  it('should not try to end when is not connected', function (done) {
    packetSocket.once('error', (error) => {
      expect(error).to.be.an.instanceOf(DomainException);
      expect(error.message).to.be.equal('Socket is not connected');
      done();
    });

    packetSocket.end();
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

  it('should throw an error when writing to a closed socket', (done) => {
    const buffer = givenAPacketBuffer();
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.fromDomain(anything())).thenReturn(buffer);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    packetSocket.on('error', (error) => {
      expect(error).to.be.an.instanceOf(Error);
      expect(error.message).to.be.equal('write EPIPE');
    });

    packetSocket.once('close', () => {
      done();
    });

    packetSocket.once('connect', () => {
      server.close();
      packetSocket.end(packet);
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

  it('should wrap an existing socket', function (done) {
    const buffer = givenAPacketBuffer();
    const packet = new Packet(givenSomePacketProps());

    when(packetMapper.fromDomain(anything())).thenReturn(buffer);
    when(packetMapper.toDomain(anything())).thenReturn(packet);

    server.once('listening', () => {
      void packetSocket.connect((server.address() as AddressInfo).port);
    });

    server.once('connection', (socket) => {
      const packetSocketServer = new PacketSocket(instance(packetMapper), socket);

      packetSocketServer.end(packet);
    });

    packetSocket.once('data', (data) => {
      expect(data).to.be.equal(packet);
      done();
    });

    server.listen(0);
  });

  describe('#connect()', () => {
    it('should connect to a server by options', function (done) {
      server.once('listening', () => {
        const address = server.address() as AddressInfo;

        void packetSocket.connect({ port: address.port });
      });

      packetSocket.once('connect', () => {
        packetSocket.end();
      });

      packetSocket.once('end', done);

      server.listen(0);
    });

    it('should connect to a server by port', function (done) {
      server.once('listening', () => {
        void packetSocket.connect((server.address() as AddressInfo).port);
      });

      packetSocket.once('connect', () => {
        packetSocket.end();
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
        packetSocket.end();
      });

      packetSocket.once('end', done);

      server.listen(0);
    });
  });
});

function givenAPacketBuffer() {
  return Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex');
}
