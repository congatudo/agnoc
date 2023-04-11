import { DeviceNetwork } from '@agnoc/domain';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { capture, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceNetworkUpdateEventHandler } from './device-network-update.event-handler';
import type { PacketMessage } from '../objects/packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceNetworkUpdateEventHandler', function () {
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceNetworkUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_WLAN_INFO_GETTING_RSP'>;
  let device: Device;

  beforeEach(function () {
    deviceRepository = imock();
    eventHandler = new DeviceNetworkUpdateEventHandler(instance(deviceRepository));
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_WLAN_INFO_GETTING_RSP');
  });

  describe('#handle()', function () {
    it('should update the device network', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_WLAN_INFO_GETTING_RSP'),
        data: {
          result: 0,
          body: {
            ipv4: '127.0.0.1',
            ssid: 'ssid',
            port: 1234,
            mask: '255.255.255.255',
            mac: '00:00:00:00:00:00',
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      const [deviceNetwork] = capture(device.updateNetwork).first();

      expect(deviceNetwork).to.be.instanceOf(DeviceNetwork);
      expect(deviceNetwork.ipv4).to.be.equal('127.0.0.1');
      expect(deviceNetwork.ssid).to.be.equal('ssid');
      expect(deviceNetwork.port).to.be.equal(1234);
      expect(deviceNetwork.mask).to.be.equal('255.255.255.255');
      expect(deviceNetwork.mac).to.be.equal('00:00:00:00:00:00');

      verify(packetMessage.assertDevice()).once();
      verify(device.updateNetwork(deviceNetwork)).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });
  });
});
