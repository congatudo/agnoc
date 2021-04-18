import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";
import { DeviceTime } from "./device-time.value-object";

export interface DeviceQuietHoursProps {
  isEnabled: boolean;
  begin: DeviceTime;
  end: DeviceTime;
}

export class DeviceQuietHours extends ValueObject<DeviceQuietHoursProps> {
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  get begin(): DeviceTime {
    return this.props.begin;
  }

  get end(): DeviceTime {
    return this.props.end;
  }

  protected validate(props: DeviceQuietHoursProps): void {
    if (![props.isEnabled, props.begin, props.end].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in device quiet hours constructor"
      );
    }

    if (!(props.begin instanceof DeviceTime)) {
      throw new ArgumentInvalidException(
        "Invalid property begin in device quiet hours constructor"
      );
    }
  }
}
