import { Server } from 'http';
import { expect } from 'chai';
import { WlanConfigCommand } from './wlan-config.command';
import type { AddressInfo } from 'net';

describe('WlanConfigCommand', function () {
  let server: Server;

  beforeEach(function (done) {
    server = new Server();
    server.listen(0, done);
  });

  afterEach(function (done) {
    server.close(done);
  });

  it('should configure the server with ssid & pass', function (done) {
    server.once('connection', (socket) => {
      socket.once('data', (chunk) => {
        expect(chunk).to.be.deep.equal(
          Buffer.from(
            '589158510000000065000000540000000000000073736964000000000000000000000000000000000000000000000000000000007061737300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a700400',
            'hex',
          ),
        );
        socket.write(Buffer.from('01020304', 'hex'));
        socket.once('close', () => {
          done();
        });
      });
    });

    const command = new WlanConfigCommand('localhost', (server.address() as AddressInfo).port);

    void command.action('ssid', 'pass', { timeout: 1000 });
  });

  it('should throw an error when the socket gets an error', function (done) {
    const command = new WlanConfigCommand('unknown', 1234);

    void command.action('ssid', 'pass', { timeout: 1000 }).catch((err) => {
      expect(err).to.be.instanceOf(Error);
      done();
    });
  });
});
