import { Server } from 'net';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { PacketSocket, Packet } from '@agnoc/transport-tcp';
import type { AddressInfo } from 'net';

declare module 'mocha' {
  interface Context {
    server: Server;
  }
}

describe('packet.socket', () => {
  beforeEach(function () {
    this.server = new Server();
  });

  afterEach(function (done) {
    if (this.server.listening) {
      this.server.close(done);
    } else {
      done();
    }
  });

  it('connects to a server', function (done) {
    const socket = new PacketSocket();

    this.server.once('listening', () => {
      void socket.connect({
        port: (this.server.address() as AddressInfo).port,
      });
    });

    socket.once('connect', () => {
      socket.end();
    });

    socket.once('end', done);

    this.server.listen(0);
  });

  it('writes packets to a server', function (done) {
    const socket = new PacketSocket();

    this.server.once('listening', () => {
      void socket.connect({
        port: (this.server.address() as AddressInfo).port,
      });
    });

    this.server.once('connection', (socket) => {
      socket.once('data', (data) => {
        expect(data.toString('hex')).to.be.equal(
          '2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c',
        );
        done();
      });
    });

    socket.once('connect', () => {
      const packet = Packet.fromJSON({
        ctype: 2,
        flow: 1,
        deviceId: 1,
        userId: 2,
        sequence: '7a479a0fbb978c12',
        payload: {
          opcode: 'DEVICE_GETTIME_RSP',
          object: {
            result: 0,
            body: {
              deviceTime: 1606129555,
              deviceTimezone: 3600,
            },
          },
        },
      });

      socket.end(packet);
    });

    this.server.listen(0);
  });

  it('writes packets to a client', function (done) {
    const socket = new PacketSocket();

    this.server.once('listening', () => {
      void socket.connect({
        port: (this.server.address() as AddressInfo).port,
      });
    });

    this.server.once('connection', (socket) => {
      socket.end(Buffer.from('2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c', 'hex'));
    });

    socket.once('connect', () => {
      socket.once('data', (packet) => {
        expect(packet).to.be.instanceof(Packet);
        expect(packet.toJSON()).to.be.deep.equal({
          ctype: 2,
          flow: 1,
          deviceId: 1,
          userId: 2,
          sequence: '7a479a0fbb978c12',
          payload: {
            opcode: 'DEVICE_GETTIME_RSP',
            object: {
              result: 0,
              body: {
                deviceTime: 1606129555,
                deviceTimezone: 3600,
              },
            },
          },
        });
        done();
      });
    });

    this.server.listen(0);
  });
});
