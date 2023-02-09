import {
  DomainPrimitive,
  ValueObject,
} from "../base-classes/value-object.base";
import { ArgumentInvalidException } from "../exceptions/argument-invalid.exception";

export class DateTime extends ValueObject<Date> {
  constructor(value: Date | string | number) {
    const date = new Date(value);

    super({ value: date });
  }

  public get value(): Date {
    return this.props.value;
  }

  public override toString(): string {
    return this.value.toISOString();
  }

  public static now(): DateTime {
    return new DateTime(Date.now());
  }

  protected validate({ value }: DomainPrimitive<Date>): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new ArgumentInvalidException("Incorrect date");
    }
  }
}
