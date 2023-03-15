import { DeviceMode, DeviceModeValue } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import type { Mapper } from '@agnoc/toolkit';

function getDomainValue(mode: number): DeviceModeValue {
  if ([0, 1, 2, 4, 5, 10, 11].includes(mode)) {
    return DeviceModeValue.None;
  }

  if ([30, 31, 32, 35].includes(mode)) {
    return DeviceModeValue.Zone;
  }

  if ([7, 9, 12, 14].includes(mode)) {
    return DeviceModeValue.Spot;
  }

  if ([36, 37, 40].includes(mode)) {
    return DeviceModeValue.Mop;
  }

  throw new DomainException(`Unable to map device mode from mode ${mode}`);
}

export class DeviceModeMapper implements Mapper<DeviceMode, number> {
  toDomain(mode: number): DeviceMode {
    return new DeviceMode(getDomainValue(mode));
  }

  fromDomain(): number {
    throw new NotImplementedException('DeviceModeMapper.toRobot');
  }
}
