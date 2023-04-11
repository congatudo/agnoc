import { DeviceConsumable, DeviceConsumableType, ResetConsumableCommand } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ResetConsumableCommandHandler } from './reset-consumable.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, DeviceRepository, Device } from '@agnoc/domain';

describe('ResetConsumableCommandHandler', function () {
  let deviceRepository: DeviceRepository;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: ResetConsumableCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    deviceRepository = imock();
    packetConnectionFinderService = imock();
    commandHandler = new ResetConsumableCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceRepository),
    );
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('ResetConsumableCommand');
  });

  describe('#handle()', function () {
    it('should reset an existing consumable', async function () {
      const mainBrush = new DeviceConsumable({ type: DeviceConsumableType.MainBrush, hoursUsed: 100 });
      const sideBrush = new DeviceConsumable({ type: DeviceConsumableType.SideBrush, hoursUsed: 50 });
      const command = new ResetConsumableCommand({
        deviceId: new ID(1),
        consumable: mainBrush,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.consumables).thenReturn([mainBrush, sideBrush]);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ', deepEqual({ itemId: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP')).once();
      verify(
        device.updateConsumables(
          deepEqual([new DeviceConsumable({ type: DeviceConsumableType.MainBrush, hoursUsed: 0 }), sideBrush]),
        ),
      ).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should reset a non existing consumable', async function () {
      const mainBrush = new DeviceConsumable({ type: DeviceConsumableType.MainBrush, hoursUsed: 100 });
      const command = new ResetConsumableCommand({
        deviceId: new ID(1),
        consumable: mainBrush,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.consumables).thenReturn(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ', deepEqual({ itemId: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP')).once();
      verify(
        device.updateConsumables(
          deepEqual([new DeviceConsumable({ type: DeviceConsumableType.MainBrush, hoursUsed: 0 })]),
        ),
      ).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when no connection is found', async function () {
      const consumable = new DeviceConsumable({ type: DeviceConsumableType.MainBrush, hoursUsed: 100 });
      const command = new ResetConsumableCommand({
        deviceId: new ID(1),
        consumable,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
      verify(device.updateSettings(anything())).never();
      verify(deviceRepository.saveOne(anything())).never();
    });
  });
});
