import { CleanSize, DeviceCleanWork, DeviceTime } from '@agnoc/domain';
import { isPresent } from '@agnoc/toolkit';
import type { DeviceBatteryMapper } from '../mappers/device-battery.mapper';
import type { DeviceErrorMapper } from '../mappers/device-error.mapper';
import type { DeviceFanSpeedMapper } from '../mappers/device-fan-speed.mapper';
import type { DeviceModeMapper } from '../mappers/device-mode.mapper';
import type { DeviceStateMapper } from '../mappers/device-state.mapper';
import type { DeviceWaterLevelMapper } from '../mappers/device-water-level.mapper';
import type { PacketEventHandler } from '../packet.event-handler';
import type { PacketMessage } from '../packet.message';
import type { DeviceRepository } from '@agnoc/domain';

export class DeviceMapWorkStatusUpdateEventHandler implements PacketEventHandler {
  readonly forName = 'DEVICE_MAPID_WORK_STATUS_PUSH_REQ';

  constructor(
    private readonly deviceStateMapper: DeviceStateMapper,
    private readonly deviceModeMapper: DeviceModeMapper,
    private readonly deviceErrorMapper: DeviceErrorMapper,
    private readonly deviceBatteryMapper: DeviceBatteryMapper,
    private readonly deviceFanSpeedMapper: DeviceFanSpeedMapper,
    private readonly deviceWaterLevelMapper: DeviceWaterLevelMapper,
    private readonly deviceRepository: DeviceRepository,
  ) {}

  async handle(message: PacketMessage<'DEVICE_MAPID_WORK_STATUS_PUSH_REQ'>): Promise<void> {
    message.assertDevice();

    const {
      battery,
      type,
      workMode,
      chargeStatus,
      cleanPreference,
      faultCode,
      waterLevel,
      mopType,
      cleanSize,
      cleanTime,
    } = message.packet.payload.data;

    message.device.updateCurrentCleanWork(
      new DeviceCleanWork({
        size: new CleanSize(cleanSize),
        time: DeviceTime.fromMinutes(cleanTime),
      }),
    );
    message.device.updateState(this.deviceStateMapper.toDomain({ type, workMode, chargeStatus }));
    message.device.updateMode(this.deviceModeMapper.toDomain(workMode));
    message.device.updateError(this.deviceErrorMapper.toDomain(faultCode));
    message.device.updateBattery(this.deviceBatteryMapper.toDomain(battery));
    message.device.updateFanSpeed(this.deviceFanSpeedMapper.toDomain(cleanPreference));

    if (isPresent(mopType)) {
      message.device.updateHasMopAttached(mopType);
    }

    if (isPresent(waterLevel)) {
      message.device.updateWaterLevel(this.deviceWaterLevelMapper.toDomain(waterLevel));
    }

    await this.deviceRepository.saveOne(message.device);
  }
}
