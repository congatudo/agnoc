import { ValueObject } from '@agnoc/toolkit';

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
      this.validateDefinedProp(props, prop);
      this.validateStringProp(props, prop);
    });
  }
}
