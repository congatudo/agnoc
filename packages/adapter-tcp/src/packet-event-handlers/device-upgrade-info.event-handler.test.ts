import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceUpgradeInfoEventHandler } from './device-upgrade-info.event-handler';
import type { PacketMessage } from '../objects/packet.message';

describe('DeviceUpgradeInfoEventHandler', function () {
  let eventHandler: DeviceUpgradeInfoEventHandler;
  let packetMessage: PacketMessage<'PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ'>;

  beforeEach(function () {
    eventHandler = new DeviceUpgradeInfoEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ');
  });

  describe('#handle()', function () {
    it('should update the device battery', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ'),
        data: {
          forceupgrade: false,
          newVersion: false,
          otaPackageVersion: '1.0.0',
          packageSize: '0',
          remoteUrl: '',
          systemVersion: '1.0.0',
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.respond('PUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP', deepEqual({ result: 0 }))).once();
    });
  });
});
