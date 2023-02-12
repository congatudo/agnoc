import { DeviceMode } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import type { ValueOf, Mapper } from '@agnoc/toolkit';

const { VALUE } = DeviceMode;

function getDomainValue(mode: number): ValueOf<typeof VALUE> {
  if ([0, 1, 2, 4, 5, 10, 11].includes(mode)) {
    return VALUE.NONE;
  }

  if ([30, 31, 32, 35].includes(mode)) {
    return VALUE.ZONE;
  }

  if ([7, 9, 12, 14].includes(mode)) {
    return VALUE.SPOT;
  }

  if ([36, 37, 40].includes(mode)) {
    return VALUE.MOP;
  }

  throw new DomainException(`Unable to map device mode from mode ${mode}`);
}

export const DeviceModeMapper: Mapper<DeviceMode, number> = class {
  static toDomain(mode: number): DeviceMode {
    return new DeviceMode({
      value: getDomainValue(mode),
    });
  }

  static fromDomain(): number {
    throw new NotImplementedException('DeviceModeMapper.toRobot');
  }
};
