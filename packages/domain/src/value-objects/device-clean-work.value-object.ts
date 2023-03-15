import { ValueObject } from '@agnoc/toolkit';
import { CleanSize } from '../domain-primitives/clean-size.domain-primitive';
import { DeviceTime } from './device-time.value-object';

/** Describe the clean work of a device. */
export interface DeviceCleanWorkProps {
  /** The size of the clean work. */
  size: CleanSize;
  /** The time of the clean work. */
  time: DeviceTime;
}

/** Describe the clean work of a device. */
export class DeviceCleanWork extends ValueObject<DeviceCleanWorkProps> {
  /** Returns the size of the clean work. */
  get size(): CleanSize {
    return this.props.size;
  }

  /** Returns the time of the clean work. */
  get time(): DeviceTime {
    return this.props.time;
  }

  protected validate(props: DeviceCleanWorkProps): void {
    const keys: (keyof DeviceCleanWorkProps)[] = ['size', 'time'];

    keys.forEach((prop) => this.validateDefinedProp(props, prop));

    this.validateInstanceProp(props, 'size', CleanSize);
    this.validateInstanceProp(props, 'time', DeviceTime);
  }
}
