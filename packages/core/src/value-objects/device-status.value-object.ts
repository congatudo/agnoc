import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

export interface DeviceStatusProps {
  currentCleanSize: number;
  currentCleanTime: number;
}

export class DeviceStatus extends ValueObject<DeviceStatusProps> {
  get currentCleanSize(): number {
    return this.props.currentCleanSize;
  }

  get currentCleanTime(): number {
    return this.props.currentCleanTime;
  }

  protected validate(props: DeviceStatusProps): void {
    if (![props.currentCleanSize, props.currentCleanTime].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in device status constructor"
      );
    }
  }
}
