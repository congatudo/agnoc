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
  DeviceWaterLevel,
  DeviceWaterLevelValue,
} from '@agnoc/domain';
import { OPCode, Packet, Payload } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceMapWorkStatusUpdateEventHandler } from './device-map-work-status-update.event-handler';
import type { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import type { DeviceErrorMapper } from '../mappers/device-error.mapper';
import type { DeviceFanSpeedMapper } from '../mappers/device-fan-speed.mapper';
import type { DeviceModeMapper } from '../mappers/device-mode.mapper';
import type { DeviceStateMapper } from '../mappers/device-state.mapper';
import type { DeviceWaterLevelMapper } from '../mappers/device-water-level.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceMapWorkStatusUpdateEventHandler', function () {
  let deviceStateMapper: DeviceStateMapper;
  let deviceModeMapper: DeviceModeMapper;
  let deviceErrorMapper: DeviceErrorMapper;
  let deviceBatteryMapper: DeviceBatteryMapper;
  let deviceFanSpeedMapper: DeviceFanSpeedMapper;
  let deviceWaterLevelMapper: DeviceWaterLevelMapper;
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceMapWorkStatusUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_MAPID_WORK_STATUS_PUSH_REQ'>;
  let device: Device;

  beforeEach(function () {
    deviceStateMapper = imock();
    deviceModeMapper = imock();
    deviceErrorMapper = imock();
    deviceBatteryMapper = imock();
    deviceFanSpeedMapper = imock();
    deviceWaterLevelMapper = imock();
    deviceRepository = imock();
    eventHandler = new DeviceMapWorkStatusUpdateEventHandler(
      instance(deviceStateMapper),
      instance(deviceModeMapper),
      instance(deviceErrorMapper),
      instance(deviceBatteryMapper),
      instance(deviceFanSpeedMapper),
      instance(deviceWaterLevelMapper),
      instance(deviceRepository),
    );
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_MAPID_WORK_STATUS_PUSH_REQ');
  });

  describe('#handle()', function () {
    it('should update the device map work status', async function () {
      const deviceState = new DeviceState(DeviceStateValue.Docked);
      const deviceMode = new DeviceMode(DeviceModeValue.None);
      const deviceError = new DeviceError(DeviceErrorValue.None);
      const deviceBattery = new DeviceBattery(5);
      const deviceFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_WORK_STATUS_PUSH_REQ'),
        data: {
          mapHeadId: 1,
          areaCleanFlag: true,
          workMode: 0,
          battery: 200,
          chargeStatus: true,
          type: 3,
          faultCode: 2105,
          cleanPreference: 3,
          repeatClean: false,
          cleanTime: 0,
          cleanSize: 0,
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(deviceStateMapper.toDomain(anything())).thenReturn(deviceState);
      when(deviceModeMapper.toDomain(anything())).thenReturn(deviceMode);
      when(deviceErrorMapper.toDomain(anything())).thenReturn(deviceError);
      when(deviceBatteryMapper.toDomain(anything())).thenReturn(deviceBattery);
      when(deviceFanSpeedMapper.toDomain(anything())).thenReturn(deviceFanSpeed);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceStateMapper.toDomain(deepEqual({ type: 3, workMode: 0, chargeStatus: true }))).once();
      verify(deviceModeMapper.toDomain(0)).once();
      verify(deviceErrorMapper.toDomain(2105)).once();
      verify(deviceBatteryMapper.toDomain(200)).once();
      verify(deviceFanSpeedMapper.toDomain(3)).once();
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
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should update optional values of device map work status', async function () {
      const deviceState = new DeviceState(DeviceStateValue.Docked);
      const deviceMode = new DeviceMode(DeviceModeValue.None);
      const deviceError = new DeviceError(DeviceErrorValue.None);
      const deviceBattery = new DeviceBattery(5);
      const deviceFanSpeed = new DeviceFanSpeed(DeviceFanSpeedValue.Low);
      const deviceWaterLevel = new DeviceWaterLevel(DeviceWaterLevelValue.Low);
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_WORK_STATUS_PUSH_REQ'),
        data: {
          mapHeadId: 1,
          areaCleanFlag: true,
          workMode: 0,
          battery: 200,
          chargeStatus: true,
          type: 3,
          faultCode: 2105,
          cleanPreference: 3,
          repeatClean: false,
          cleanTime: 0,
          cleanSize: 0,
          waterLevel: 12,
          dustBoxType: 3,
          mopType: false,
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(deviceStateMapper.toDomain(anything())).thenReturn(deviceState);
      when(deviceModeMapper.toDomain(anything())).thenReturn(deviceMode);
      when(deviceErrorMapper.toDomain(anything())).thenReturn(deviceError);
      when(deviceBatteryMapper.toDomain(anything())).thenReturn(deviceBattery);
      when(deviceFanSpeedMapper.toDomain(anything())).thenReturn(deviceFanSpeed);
      when(deviceWaterLevelMapper.toDomain(anything())).thenReturn(deviceWaterLevel);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceWaterLevelMapper.toDomain(12)).once();
      verify(device.updateHasMopAttached(false)).once();
      verify(device.updateWaterLevel(deviceWaterLevel)).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });
  });
});
