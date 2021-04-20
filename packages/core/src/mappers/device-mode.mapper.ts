import { Mapper } from "../base-classes/mapper.base";
import { DomainException } from "../exceptions/domain.exception";
import { NotImplementedException } from "../exceptions/not-implemented.exception";
import { ValueOf } from "../types/value-of.type";
import { DeviceMode } from "../value-objects/device-mode.value-object";

const { VALUE } = DeviceMode;

function getDomainValue(mode: number): ValueOf<typeof VALUE> {
  if ([0, 1, 4, 5, 10].includes(mode)) {
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

  static toRobot(): number {
    throw new NotImplementedException("DeviceModeMapper.toRobot");
  }
};
