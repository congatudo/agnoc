import { ValueObject } from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { isPresent } from "../utils/is-present.util";

export const CONSUMABLE_TYPE = {
  MAIN_BRUSH: "mainBrush",
  SIDE_BRUSH: "sideBrush",
  FILTER: "filter",
  DISHCLOTH: "dishcloth",
} as const;

export type ConsumableType =
  typeof CONSUMABLE_TYPE[keyof typeof CONSUMABLE_TYPE];

export interface DeviceConsumableProps {
  type: ConsumableType;
  used: number;
}

export class DeviceConsumable extends ValueObject<DeviceConsumableProps> {
  get type(): ConsumableType {
    return this.props.type;
  }

  get used(): number {
    return this.props.used;
  }

  protected validate(props: DeviceConsumableProps): void {
    if (![props.type, props.used].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in device consumable constructor"
      );
    }

    if (!Object.values(CONSUMABLE_TYPE).includes(props.type)) {
      throw new ArgumentInvalidException(
        "Invalid property type in device consumable constructor"
      );
    }
  }
}
