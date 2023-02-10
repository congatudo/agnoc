import { DomainPrimitive, ValueObject } from '../base-classes/value-object.base';
import { ArgumentInvalidException } from '../exceptions/argument-invalid.exception';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { isPresent } from '../utils/is-present.util';

const MIN_VALUE = 0;
const MAX_VALUE = 100;

export class DeviceBattery extends ValueObject<number> {
  get value(): number {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<number>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device fan speed constructor');
    }

    if (props.value < MIN_VALUE || props.value > MAX_VALUE) {
      throw new ArgumentInvalidException('Invalid property in device battery constructor');
    }
  }

  static MIN_VALUE = MIN_VALUE;
  static MAX_VALUE = MAX_VALUE;
}
