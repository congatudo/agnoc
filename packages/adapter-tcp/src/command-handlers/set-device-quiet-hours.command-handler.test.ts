import { DeviceTime, QuietHoursSetting, SetDeviceQuietHoursCommand } from '@agnoc/domain';
import { givenSomeQuietHoursSettingProps } from '@agnoc/domain/test-support';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { SetDeviceQuietHoursCommandHandler } from './set-device-quiet-hours.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketConnectionFinderService } from '../packet-connection-finder.service';
import type { PacketMessage } from '../packet.message';

describe('SetDeviceQuietHoursCommandHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: SetDeviceQuietHoursCommandHandler;
  let packetConnection: PacketConnection;
  let packetMessage: PacketMessage;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    commandHandler = new SetDeviceQuietHoursCommandHandler(instance(packetConnectionFinderService));
    packetConnection = imock();
    packetMessage = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('SetDeviceQuietHoursCommand');
  });

  describe('#handle()', function () {
    it('should send locate device command', async function () {
      const command = new SetDeviceQuietHoursCommand({
        deviceId: new ID(1),
        quietHours: new QuietHoursSetting({
          isEnabled: true,
          beginTime: DeviceTime.fromMinutes(0),
          endTime: DeviceTime.fromMinutes(180),
        }),
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));

      await commandHandler.handle(command);

      verify(
        packetConnection.sendAndWait(
          'USER_SET_DEVICE_QUIETHOURS_REQ',
          deepEqual({
            isOpen: true,
            beginTime: 0,
            endTime: 180,
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('USER_SET_DEVICE_QUIETHOURS_RSP')).once();
    });

    it('should do nothing when no connection is found', async function () {
      const command = new SetDeviceQuietHoursCommand({
        deviceId: new ID(1),
        quietHours: new QuietHoursSetting(givenSomeQuietHoursSettingProps()),
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
    });
  });
});
