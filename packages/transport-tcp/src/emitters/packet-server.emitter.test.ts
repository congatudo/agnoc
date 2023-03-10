import { Socket } from 'net';
import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketSocket } from '../sockets/packet.socket';
import { PacketServer } from './packet-server.emitter';
import type { PacketMapper } from '../mappers/packet.mapper';

describe('PacketServer', function () {
  let packetServer: PacketServer;
  let packetMapper: PacketMapper;

  beforeEach(function () {
    packetMapper = imock();
    packetServer = new PacketServer(instance(packetMapper));
  });

  afterEach(async function () {
    if (packetServer.isListening) {
      await packetServer.close();
    }
  });

  it('should be a server', function () {
    expect(packetServer).to.be.an.instanceof(PacketServer);
    expect(packetServer.isListening).to.be.false;
    expect(packetServer.address).to.be.null;
  });

  it('should receive connections', function (done) {
    const socket = new Socket();

    packetServer.once('connection', (socket) => {
      expect(socket).to.be.instanceof(PacketSocket);
      done();
    });

    void packetServer.listen(0).then(() => {
      expect(packetServer.address?.port).to.be.a('number');

      socket.connect(packetServer.address?.port as number);
      socket.end();
    });
  });

  it('should close the server', function (done) {
    packetServer.once('close', () => {
      expect(packetServer.isListening).to.be.false;
      done();
    });

    packetServer.once('listening', () => {
      void packetServer.close();
    });

    void packetServer.listen(0);
  });

  it('should emit errors', function (done) {
    void packetServer.close().catch((error) => {
      expect(error).to.be.an.instanceof(Error);
      expect((error as Error).message).to.be.equal('Server is not running.');
      done();
    });
  });

  describe('#listen()', function () {
    it('should listen by port', function (done) {
      packetServer.once('listening', () => {
        expect(packetServer.isListening).to.be.true;
        expect(packetServer.address).to.be.an.instanceof(Object);
        done();
      });

      void packetServer.listen(0);
    });

    it('should listen by host and port', function (done) {
      packetServer.once('listening', () => {
        expect(packetServer.isListening).to.be.true;
        expect(packetServer.address).to.be.an.instanceof(Object);
        done();
      });

      void packetServer.listen(0, 'localhost');
    });

    it('should listen by options', function (done) {
      packetServer.once('listening', () => {
        expect(packetServer.isListening).to.be.true;
        expect(packetServer.address).to.be.an.instanceof(Object);
        done();
      });

      void packetServer.listen({ port: 0 });
    });
  });
});
