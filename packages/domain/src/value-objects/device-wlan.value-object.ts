import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

/** The properties of the device wlan. */
export interface DeviceWlanProps {
  /** The ipv4 address. */
  ipv4: string;
  /** The ssid. */
  ssid: string;
  /** The port. */
  port: number;
  /** The mask. */
  mask: string;
  /** The mac. */
  mac: string;
}

/** Describe the wlan of a device. */
export class DeviceWlan extends ValueObject<DeviceWlanProps> {
  /** Returns the ipv4 address. */
  get ipv4(): string {
    return this.props.ipv4;
  }

  /** Returns the ssid. */
  get ssid(): string {
    return this.props.ssid;
  }

  /** Returns the port. */
  get port(): number {
    return this.props.port;
  }

  /** Returns the mask. */
  get mask(): string {
    return this.props.mask;
  }

  /** Returns the mac. */
  get mac(): string {
    return this.props.mac;
  }

  protected validate(props: DeviceWlanProps): void {
    const keys: (keyof DeviceWlanProps)[] = ['ipv4', 'ssid', 'port', 'mask', 'mac'];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (typeof props.ipv4 !== 'string') {
      throw new ArgumentInvalidException(
        `Value '${props.ipv4 as string}' for property 'ipv4' for ${this.constructor.name} is not a string`,
      );
    }

    if (typeof props.ssid !== 'string') {
      throw new ArgumentInvalidException(
        `Value '${props.ssid as string}' for property 'ssid' for ${this.constructor.name} is not a string`,
      );
    }

    if (typeof props.port !== 'number') {
      throw new ArgumentInvalidException(
        `Value '${props.port as string}' for property 'port' for ${this.constructor.name} is not a number`,
      );
    }

    if (typeof props.mask !== 'string') {
      throw new ArgumentInvalidException(
        `Value '${props.mask as string}' for property 'mask' for ${this.constructor.name} is not a string`,
      );
    }

    if (typeof props.mac !== 'string') {
      throw new ArgumentInvalidException(
        `Value '${props.mac as string}' for property 'mac' for ${this.constructor.name} is not a string`,
      );
    }
  }
}
