import { DeviceMap, DeviceMode, DeviceModeValue, MapPosition, PauseCleaningCommand } from '@agnoc/domain';
import { givenSomeDeviceMapProps } from '@agnoc/domain/test-support';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PauseCleaningCommandHandler } from './pause-cleaning.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, Device } from '@agnoc/domain';

describe('PauseCleaningCommandHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let commandHandler: PauseCleaningCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    commandHandler = new PauseCleaningCommandHandler(instance(packetConnectionFinderService));
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('PauseCleaningCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
    });

    it('should pause cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', deepEqual({ ctrlValue: 2, cleanType: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
    });

    it('should pause zone cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_AREA_CLEAN_REQ', deepEqual({ ctrlValue: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AREA_CLEAN_RSP')).once();
    });

    it('should pause mop cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_MOP_FLOOR_CLEAN_REQ', deepEqual({ ctrlValue: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_MOP_FLOOR_CLEAN_RSP')).once();
    });

    it('should pause spot cleaning', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        id: new ID(1),
        currentSpot: new MapPosition({ x: 0, y: 0, phi: 0 }),
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.map).thenReturn(deviceMap);

      await commandHandler.handle(command);

      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_NAVIGATION_REQ',
          deepEqual({
            mapHeadId: 1,
            poseX: 0,
            poseY: 0,
            posePhi: 0,
            ctrlValue: 2,
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP')).once();
    });

    it('should throw an error when trying to spot clean without map', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.map).thenReturn(undefined);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to pause spot cleaning, no map available',
      );
    });

    it('should throw an error when trying to spot clean without current spot', async function () {
      const command = new PauseCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        currentSpot: undefined,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.map).thenReturn(deviceMap);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to pause spot cleaning, no spot selected',
      );
    });
  });
});
