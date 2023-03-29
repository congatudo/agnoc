import {
  DeviceMap,
  DeviceMode,
  DeviceModeValue,
  DeviceState,
  DeviceStateValue,
  MapCoordinate,
  MapPosition,
  Room,
  StartCleaningCommand,
  Zone,
} from '@agnoc/domain';
import { givenSomeDeviceMapProps, givenSomeRoomProps } from '@agnoc/domain/test-support';
import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { StartCleaningCommandHandler } from './start-cleaning.command-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceModeChangerService } from '../services/device-mode-changer.service';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, Device, DeviceSystem } from '@agnoc/domain';

describe('StartCleaningCommandHandler', function () {
  let packetConnectionFinderService: PacketConnectionFinderService;
  let deviceModeChangerService: DeviceModeChangerService;
  let commandHandler: StartCleaningCommandHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;
  let deviceSystem: DeviceSystem;

  beforeEach(function () {
    packetConnectionFinderService = imock();
    deviceModeChangerService = imock();
    commandHandler = new StartCleaningCommandHandler(
      instance(packetConnectionFinderService),
      instance(deviceModeChangerService),
    );
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
    deviceSystem = imock();
  });

  it('should define the name', function () {
    expect(commandHandler.forName).to.be.equal('StartCleaningCommand');
  });

  describe('#handle()', function () {
    it('should do nothing when no connection is found', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
    });

    it('should start cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(undefined);
      when(device.hasMopAttached).thenReturn(false);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(packetConnection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', deepEqual({ ctrlValue: 1, cleanType: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
    });

    it('should enable whole clean when supported', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        id: new ID(1),
        rooms: [new Room({ ...givenSomeRoomProps(), id: new ID(1), name: 'Room 1' })],
        restrictedZones: [new Zone({ id: new ID(1), coordinates: [new MapCoordinate({ x: 0, y: 0 })] })],
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(true);
      when(device.mode).thenReturn(undefined);
      when(device.state).thenReturn(new DeviceState(DeviceStateValue.Docked));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(deviceMap);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_PLAN_PARAMS_REQ',
          deepEqual({
            mapHeadId: 1,
            mapName: 'Default',
            planId: 2,
            planName: 'Default',
            roomList: [{ roomId: 1, roomName: 'Room 1', enable: true }],
            areaInfo: {
              mapHeadId: 1,
              planId: 2,
              cleanAreaLength: 1,
              cleanAreaList: [{ cleanAreaId: 1, type: 0, coordinateLength: 1, coordinateList: [{ x: 0, y: 0 }] }],
            },
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_PLAN_PARAMS_RSP')).once();
      verify(packetConnection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', deepEqual({ ctrlValue: 1, cleanType: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
    });

    it('should not enable whole clean when device has no map', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(true);
      when(device.mode).thenReturn(undefined);
      when(device.state).thenReturn(new DeviceState(DeviceStateValue.Docked));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(undefined);

      await commandHandler.handle(command);

      verify(packetConnection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', deepEqual({ ctrlValue: 1, cleanType: 2 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
    });

    it('should start zone cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));
      when(device.hasMopAttached).thenReturn(false);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(packetConnection.sendAndWait('DEVICE_AREA_CLEAN_REQ', deepEqual({ ctrlValue: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_AREA_CLEAN_RSP')).once();
    });

    it('should start mop cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
      when(device.hasMopAttached).thenReturn(true);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(instance(packetConnection), deepEqual(new DeviceMode(DeviceModeValue.Mop))),
      ).once();
      verify(packetConnection.sendAndWait('DEVICE_MOP_FLOOR_CLEAN_REQ', deepEqual({ ctrlValue: 1 }))).once();
      verify(packetMessage.assertPayloadName('DEVICE_MOP_FLOOR_CLEAN_RSP')).once();
    });

    it('should start spot cleaning', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        id: new ID(1),
        currentSpot: new MapPosition({ x: 0, y: 0, phi: 0 }),
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(deviceMap);

      await commandHandler.handle(command);

      verify(
        deviceModeChangerService.changeMode(
          instance(packetConnection),
          deepEqual(new DeviceMode(DeviceModeValue.None)),
        ),
      ).once();
      verify(
        packetConnection.sendAndWait(
          'DEVICE_MAPID_SET_NAVIGATION_REQ',
          deepEqual({
            mapHeadId: 1,
            poseX: 0,
            poseY: 0,
            posePhi: 0,
            ctrlValue: 1,
          }),
        ),
      ).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP')).once();
    });

    it('should throw an error when trying to spot clean without map', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(undefined);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to start spot cleaning, no map available',
      );
    });

    it('should throw an error when trying to spot clean without current spot', async function () {
      const command = new StartCleaningCommand({ deviceId: new ID(1) });
      const deviceMap = new DeviceMap({
        ...givenSomeDeviceMapProps(),
        currentSpot: undefined,
      });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetConnection.device).thenReturn(instance(device));
      when(device.system).thenReturn(instance(deviceSystem));
      when(deviceSystem.supports(anything())).thenReturn(false);
      when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));
      when(device.hasMopAttached).thenReturn(false);
      when(device.map).thenReturn(deviceMap);

      await expect(commandHandler.handle(command)).to.be.rejectedWith(
        DomainException,
        'Unable to start spot cleaning, no spot selected',
      );
    });
  });
});
