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
    const keys = ['software', 'hardware'] as (keyof DeviceVersionProps)[];

    keys.forEach((prop) => {
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for device version not provided`);
      }

      if (typeof value !== 'string') {
        throw new ArgumentInvalidException(
          `Value '${value as string}' for property '${prop}' for device version is not a string`,
        );
      }
    });
  }
}
