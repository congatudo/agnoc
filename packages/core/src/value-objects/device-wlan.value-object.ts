import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

export interface DeviceWlanProps {
  ipv4: string;
  ssid: string;
  port: number;
  mask: string;
  mac: string;
}

export class DeviceWlan extends ValueObject<DeviceWlanProps> {
  get ipv4(): string {
    return this.props.ipv4;
  }

  get ssid(): string {
    return this.props.ssid;
  }

  get port(): number {
    return this.props.port;
  }

  get mask(): string {
    return this.props.mask;
  }

  get mac(): string {
    return this.props.mac;
  }

  protected validate(props: DeviceWlanProps): void {
    if (
      ![props.ipv4, props.ssid, props.port, props.mask, props.mac].every(
        isPresent
      )
    ) {
      throw new ArgumentNotProvidedException(
        "Missing property in device wlan constructor"
      );
    }
  }
}
