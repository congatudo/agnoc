import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceCleanMapDataReportEventHandler } from './device-clean-map-data-report.event-handler';
import type { PacketMessage } from '../packet.message';

describe('DeviceCleanMapDataReportEventHandler', function () {
  let eventHandler: DeviceCleanMapDataReportEventHandler;
  let packetMessage: PacketMessage<'DEVICE_CLEANMAP_BINDATA_REPORT_REQ'>;

  beforeEach(function () {
    eventHandler = new DeviceCleanMapDataReportEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_CLEANMAP_BINDATA_REPORT_REQ');
  });

  describe('#handle()', function () {
    it('should update the device version', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_CLEANMAP_BINDATA_REPORT_REQ'),
        data: { cleanId: 1 },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.respond('DEVICE_CLEANMAP_BINDATA_REPORT_RSP', deepEqual({ result: 0, cleanId: 1 }))).once();
    });
  });
});
