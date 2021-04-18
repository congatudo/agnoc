import {
  DomainPrimitive,
  ValueObject,
} from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "../exceptions/argument-not-provided.exception";
import { ValueOf } from "../types/value-of.type";
import { isPresent } from "../utils/is-present.util";

const VALUE = {
  NONE: "none",
  SPOT: "spot",
  ZONE: "zone",
  MOP: "mop",
} as const;

type Value = ValueOf<typeof VALUE>;

export class DeviceMode extends ValueObject<Value> {
  get value(): Value {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<Value>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in device mode constructor"
      );
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException(
        "Invalid property in device mode constructor"
      );
    }
  }

  static VALUE = VALUE;
}
