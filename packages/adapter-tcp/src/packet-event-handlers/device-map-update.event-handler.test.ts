import {
  CleanSize,
  DeviceBattery,
  DeviceCleanWork,
  DeviceError,
  DeviceErrorValue,
  DeviceFanSpeed,
  DeviceFanSpeedValue,
  DeviceMode,
  DeviceModeValue,
  DeviceState,
  DeviceStateValue,
  DeviceTime,
  MapCoordinate,
  MapPixel,
  MapPosition,
  DeviceMap,
  Zone,
  Room,
} from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceMapUpdateEventHandler } from './device-map-update.event-handler';
import type { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import type { DeviceErrorMapper } from '../mappers/device-error.mapper';
import type { DeviceFanSpeedMapper } from '../mappers/device-fan-speed.mapper';
import type { DeviceModeMapper } from '../mappers/device-mode.mapper';
import type { DeviceStateMapper } from '../mappers/device-state.mapper';
import type { PacketMessage } from '../packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceMapUpdateEventHandler', function () {
  let deviceBatteryMapper: DeviceBatteryMapper;
  let deviceModeMapper: DeviceModeMapper;
  let deviceStateMapper: DeviceStateMapper;
  let deviceErrorMapper: DeviceErrorMapper;
  let deviceFanSpeedMapper: DeviceFanSpeedMapper;
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceMapUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_MAPID_GET_GLOBAL_INFO_RSP'>;
  let device: Device;
  let deviceMap: DeviceMap;

  beforeEach(function () {
    deviceBatteryMapper = imock();
    deviceModeMapper = imock();
    deviceStateMapper = imock();
    deviceErrorMapper = imock();
    deviceFanSpeedMapper = imock();
    deviceRepository = imock();
    eventHandler = new DeviceMapUpdateEventHandler(
      instance(deviceBatteryMapper),
      instance(deviceModeMapper),
      instance(deviceStateMapper),
      instance(deviceErrorMapper),
      instance(deviceFanSpeedMapper),
      instance(deviceRepository),
    );
    packetMessage = imock();
    device = imock();
    deviceMap = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_MAPID_GET_GLOBAL_INFO_RSP');
  });

  describe('#handle()', function () {
    it('should do nothing when there is no data', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: { mask: 0 },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(undefined);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceBatteryMapper.toDomain(anything())).never();
      verify(deviceModeMapper.toDomain(anything())).never();
      verify(deviceStateMapper.toDomain(anything())).never();
      verify(deviceErrorMapper.toDomain(anything())).never();
      verify(deviceFanSpeedMapper.toDomain(anything())).never();
      verify(device.updateMap(anything())).never();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update the status info', async function () {
      const deviceBattery = new DeviceBattery(5);
      const deviceState = new DeviceState(DeviceStateValue.Docked);
      const deviceMode = new DeviceMode(DeviceModeValue.None);
      const deviceError = new DeviceError(DeviceErrorValue.None);
      const deviceFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          statusInfo: {
            mapHeadId: 1,
            hasHistoryMap: true,
            workingMode: 0,
            batteryPercent: 100,
            chargeState: false,
            faultType: 3,
            faultCode: 2103,
            cleanPreference: 1,
            repeatClean: false,
            cleanTime: 0,
            cleanSize: 0,
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(deviceBatteryMapper.toDomain(anything())).thenReturn(deviceBattery);
      when(deviceStateMapper.toDomain(anything())).thenReturn(deviceState);
      when(deviceModeMapper.toDomain(anything())).thenReturn(deviceMode);
      when(deviceErrorMapper.toDomain(anything())).thenReturn(deviceError);
      when(deviceFanSpeedMapper.toDomain(anything())).thenReturn(deviceFanSpeed);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(undefined);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceStateMapper.toDomain(deepEqual({ type: 3, workMode: 0, chargeStatus: false }))).once();
      verify(deviceModeMapper.toDomain(0)).once();
      verify(deviceErrorMapper.toDomain(2103)).once();
      verify(deviceBatteryMapper.toDomain(100)).once();
      verify(deviceFanSpeedMapper.toDomain(1)).once();
      verify(
        device.updateCurrentCleanWork(
          deepEqual(new DeviceCleanWork({ size: new CleanSize(0), time: DeviceTime.fromMinutes(0) })),
        ),
      ).once();
      verify(device.updateState(deviceState)).once();
      verify(device.updateMode(deviceMode)).once();
      verify(device.updateError(deviceError)).once();
      verify(device.updateBattery(deviceBattery)).once();
      verify(device.updateFanSpeed(deviceFanSpeed)).once();
      verify(device.updateMap(anything())).never();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do create a map', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          mapHeadInfo: {
            mapHeadId: 1,
            mapValid: 1,
            mapType: 1,
            sizeX: 800,
            sizeY: 800,
            minX: -20,
            minY: -20,
            maxX: 20,
            maxY: 20,
            resolution: 0.05,
          },
          mapGrid: Buffer.alloc(0),
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(undefined);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(
        device.updateMap(
          deepEqual(
            new DeviceMap({
              id: new ID(1),
              size: new MapPixel({ x: 800, y: 800 }),
              min: new MapCoordinate({ x: -20, y: -20 }),
              max: new MapCoordinate({ x: 20, y: 20 }),
              resolution: 0.05,
              grid: Buffer.alloc(0),
              rooms: [],
              restrictedZones: [],
              robotPath: [],
            }),
          ),
        ),
      ).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update a map', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          mapHeadInfo: {
            mapHeadId: 1,
            mapValid: 1,
            mapType: 1,
            sizeX: 800,
            sizeY: 800,
            minX: -20,
            minY: -20,
            maxX: 20,
            maxY: 20,
            resolution: 0.05,
          },
          mapGrid: Buffer.alloc(0),
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));
      when(deviceMap.clone(anything())).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(
        deviceMap.clone(
          deepEqual({
            id: new ID(1),
            size: new MapPixel({ x: 800, y: 800 }),
            min: new MapCoordinate({ x: -20, y: -20 }),
            max: new MapCoordinate({ x: 20, y: 20 }),
            resolution: 0.05,
            grid: Buffer.alloc(0),
            rooms: [],
            restrictedZones: [],
            robotPath: [],
          }),
        ),
      ).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update map robot path', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          historyHeadInfo: {
            mapHeadId: 1,
            poseId: 1,
            pointList: [
              { flag: 0, x: 0, y: 0 },
              { flag: 1, x: 1, y: 1 },
            ],
            pointNumber: 0,
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));
      when(deviceMap.robotPath).thenReturn([]);

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(
        deviceMap.updateRobotPath(deepEqual([new MapCoordinate({ x: 0, y: 0 }), new MapCoordinate({ x: 1, y: 1 })])),
      ).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update map robot position', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          robotPoseInfo: {
            mapHeadId: 1,
            poseId: 0,
            update: 1,
            poseX: 0,
            poseY: 1,
            posePhi: 2,
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceMap.updateRobot(deepEqual(new MapPosition({ x: 0, y: 1, phi: 2 })))).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update map charger position', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          robotChargeInfo: {
            mapHeadId: 1,
            poseX: 0,
            poseY: 1,
            posePhi: 2,
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceMap.updateCharger(deepEqual(new MapPosition({ x: 0, y: 1, phi: 2 })))).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update map spot position', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          spotInfo: {
            mapHeadId: 1,
            ctrlValue: 0,
            poseX: 0,
            poseY: 1,
            posePhi: 2,
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceMap.updateCurrentSpot(deepEqual(new MapPosition({ x: 0, y: 1, phi: 2 })))).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update map restricted zones', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          wallListInfo: {
            mapHeadId: 1,
            cleanPlanId: 2,
            cleanAreaList: [
              {
                cleanAreaId: 3,
                cleanPlanId: 2,
                coordinateList: [
                  { x: 0, y: 0 },
                  { x: 1, y: 1 },
                ],
              },
            ],
          },
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(
        deviceMap.updateRestrictedZones(
          deepEqual([
            new Zone({
              id: new ID(3),
              coordinates: [new MapCoordinate({ x: 0, y: 0 }), new MapCoordinate({ x: 1, y: 1 })],
            }),
          ]),
        ),
      ).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do update map rooms', async function () {
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP'),
        data: {
          mask: 0,
          currentPlanId: 2,
          cleanPlanList: [
            {
              planId: 2,
              planName: 'plan1',
              mapHeadId: 1,
              currentPlanId: 1,
              areaInfoList: [],
              cleanRoomInfoList: [{ roomId: 3, enable: 1 }],
            },
          ],
          cleanRoomList: [
            { roomId: 3, roomName: 'room1', roomState: 0, roomX: 0, roomY: 0 },
            { roomId: 4, roomName: 'room2', roomState: 0, roomX: 0, roomY: 0 },
          ],
          roomSegmentList: [
            {
              roomId: 3,
              roomPixelList: [
                { mask: 0, x: 1, y: 1 },
                { mask: 1, x: 2, y: 2 },
              ],
            },
          ],
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));
      when(device.map).thenReturn(instance(deviceMap));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(
        deviceMap.updateRooms(
          deepEqual([
            new Room({
              id: new ID(3),
              name: 'room1',
              isEnabled: true,
              center: new MapCoordinate({ x: 0, y: 0 }),
              pixels: [new MapPixel({ x: 1, y: 1 }), new MapPixel({ x: 2, y: 2 })],
            }),
          ]),
        ),
      ).once();
      verify(device.updateMap(instance(deviceMap))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });
  });
});
