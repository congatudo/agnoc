import { ValueObject } from '@agnoc/toolkit';

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
      this.validateDefinedProp(props, prop);
    });

    this.validateStringProp(props, 'ipv4');
    this.validateStringProp(props, 'ssid');
    this.validateNumberProp(props, 'port');
    this.validateStringProp(props, 'mask');
    this.validateStringProp(props, 'mac');
  }
}
