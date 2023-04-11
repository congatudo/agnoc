import { ValueObject } from '@agnoc/toolkit';

/** The properties of the device network. */
export interface DeviceNetworkProps {
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

/** Describe the network of a device. */
export class DeviceNetwork extends ValueObject<DeviceNetworkProps> {
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

  protected validate(props: DeviceNetworkProps): void {
    const keys: (keyof DeviceNetworkProps)[] = ['ipv4', 'ssid', 'port', 'mask', 'mac'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateTypeProp(props, 'ipv4', 'string');
    this.validateTypeProp(props, 'ssid', 'string');
    this.validateNumberProp(props, 'port');
    this.validateTypeProp(props, 'mask', 'string');
    this.validateTypeProp(props, 'mac', 'string');
  }
}
