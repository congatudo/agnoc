import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

/** The properties of the device version. */
export interface DeviceVersionProps {
  /** The software version. */
  software: string;
  /** The hardware version. */
  hardware: string;
}

/** Describe the version of a device. */
export class DeviceVersion extends ValueObject<DeviceVersionProps> {
  /** Returns the software version. */
  get software(): string {
    return this.props.software;
  }

  /** Returns the hardware version. */
  get hardware(): string {
    return this.props.hardware;
  }

  protected validate(props: DeviceVersionProps): void {
    const keys: (keyof DeviceVersionProps)[] = ['software', 'hardware'];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }

      if (typeof value !== 'string') {
        throw new ArgumentInvalidException(
          `Value '${value as string}' for property '${prop}' for ${this.constructor.name} is not a string`,
        );
      }
    });
  }
}
