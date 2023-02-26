import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { CleanSize } from '../primitives/clean-size.value-object';
import { DeviceTime } from './device-time.value-object';

/** Describe the clean work of a device. */
export interface DeviceCleanProps {
  /** The size of the clean work. */
  size: CleanSize;
  /** The time of the clean work. */
  time: DeviceTime;
}

/** Describe the clean work of a device. */
export class DeviceCleanWork extends ValueObject<DeviceCleanProps> {
  /** Returns the size of the clean work. */
  get size(): CleanSize {
    return this.props.size;
  }

  /** Returns the time of the clean work. */
  get time(): DeviceTime {
    return this.props.time;
  }

  protected validate(props: DeviceCleanProps): void {
    const keys = ['size', 'time'] as (keyof DeviceCleanProps)[];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for device clean not provided`);
      }
    });

    if (!(props.size instanceof CleanSize)) {
      throw new ArgumentInvalidException(
        `Value '${props.size as string}' for property 'size' for device clean is not a clean size`,
      );
    }

    if (!(props.time instanceof DeviceTime)) {
      throw new ArgumentInvalidException(
        `Value '${props.time as string}' for property 'time' for device clean is not a device time`,
      );
    }
  }
}
