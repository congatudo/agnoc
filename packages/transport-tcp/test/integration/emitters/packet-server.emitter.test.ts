import { Socket } from 'net';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import {
  getCustomDecoders,
  getProtobufRoot,
  PacketMapper,
  PacketServer,
  PacketSocket,
  PayloadFactory,
  PayloadObjectParserService,
} from '@agnoc/transport-tcp';

declare module 'mocha' {
  interface Context {
    packetServer: PacketServer;
  }
}

const payloadFactory = new PayloadFactory(new PayloadObjectParserService(getProtobufRoot(), getCustomDecoders()));
const packetMapper = new PacketMapper(payloadFactory);

describe('packet-server.emitter', () => {
  beforeEach(function () {
    this.packetServer = new PacketServer(packetMapper);
  });

  afterEach(async function () {
    if (this.packetServer.isListening) {
      await this.packetServer.close();
    }
  });

  it('emits listening event', function (done) {
    this.packetServer.once('listening', () => {
      expect(this.packetServer.isListening).to.be.true;
      done();
    });

    void this.packetServer.listen(0);
  });

  it('emits connection event', function (done) {
    const socket = new Socket();

    this.packetServer.once('connection', (socket) => {
      expect(socket).to.be.instanceof(PacketSocket);
      done();
    });

    void this.packetServer.listen(0).then(() => {
      expect(this.packetServer.address).to.not.be.null;

      socket.connect({ port: this.packetServer.address?.port as number });
      socket.end();
    });
  });

  it('emits close event', function (done) {
    this.packetServer.once('close', () => {
      done();
    });

    this.packetServer.once('listening', () => {
      void this.packetServer.close();
    });

    void this.packetServer.listen(0);
  });
});
