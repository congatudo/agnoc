import {
  ValueOf,
  ValueObject,
  DomainPrimitive,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';

const VALUE = {
  OFF: 'off',
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

type Value = ValueOf<typeof VALUE>;

export class DeviceFanSpeed extends ValueObject<Value> {
  get value(): Value {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<Value>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device fan speed constructor');
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device fan speed constructor');
    }
  }

  static VALUE = VALUE;
}
