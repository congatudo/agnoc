import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceCleanMapReportEventHandler } from './device-clean-map-report.event-handler';
import type { PacketMessage } from '../packet.message';

describe('DeviceCleanMapReportEventHandler', function () {
  let eventHandler: DeviceCleanMapReportEventHandler;
  let packetMessage: PacketMessage<'DEVICE_EVENT_REPORT_CLEANMAP'>;

  beforeEach(function () {
    eventHandler = new DeviceCleanMapReportEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_EVENT_REPORT_CLEANMAP');
  });

  describe('#handle()', function () {
    it('should update the device version', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_EVENT_REPORT_CLEANMAP'),
        data: { cleanId: 1 },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.respond('DEVICE_EVENT_REPORT_RSP', deepEqual({ result: 0, body: { cleanId: 1 } }))).once();
    });
  });
});
