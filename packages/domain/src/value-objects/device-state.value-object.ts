import {
  ValueOf,
  ValueObject,
  DomainPrimitive,
  isPresent,
  ArgumentNotProvidedException,
  ArgumentInvalidException,
} from '@agnoc/toolkit';

const VALUE = {
  ERROR: 'error',
  DOCKED: 'docked',
  IDLE: 'idle',
  RETURNING: 'returning',
  CLEANING: 'cleaning',
  PAUSED: 'paused',
  MANUAL_CONTROL: 'manual_control',
  MOVING: 'moving',
} as const;

type Value = ValueOf<typeof VALUE>;

export class DeviceState extends ValueObject<Value> {
  get value(): Value {
    return this.props.value;
  }

  protected validate(props: DomainPrimitive<Value>): void {
    if (![props.value].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device state constructor');
    }

    if (!Object.values(VALUE).includes(props.value)) {
      throw new ArgumentInvalidException('Invalid property in device state constructor');
    }
  }

  static VALUE = VALUE;
}
