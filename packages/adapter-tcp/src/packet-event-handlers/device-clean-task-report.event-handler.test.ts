import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceCleanTaskReportEventHandler } from './device-clean-task-report.event-handler';
import type { PacketMessage } from '../packet.message';

describe('DeviceCleanTaskReportEventHandler', function () {
  let eventHandler: DeviceCleanTaskReportEventHandler;
  let packetMessage: PacketMessage<'DEVICE_EVENT_REPORT_CLEANTASK'>;

  beforeEach(function () {
    eventHandler = new DeviceCleanTaskReportEventHandler();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_EVENT_REPORT_CLEANTASK');
  });

  describe('#handle()', function () {
    it('should update the device version', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_EVENT_REPORT_CLEANTASK'),
        data: {
          cleanId: 1,
          startTime: 0,
          endTime: 180,
          unk4: 0,
          unk5: 0,
          unk6: 0,
          unk7: 0,
          unk8: { unk1Unk1: 0, unk1Unk2: 0, unk1Unk6: 0 },
          mapHeadId: 2,
          mapName: 'map',
          planName: 'plan',
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.respond('UNK_11A4', deepEqual({ unk1: 0 }))).once();
    });
  });
});
