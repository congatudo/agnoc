import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

/** Describe the type of a device consumable. */
export enum DeviceConsumableType {
  MainBrush = 'mainBrush',
  SideBrush = 'sideBrush',
  Filter = 'filter',
  Dishcloth = 'dishcloth',
}

/** Describe the props of a device consumable. */
export interface DeviceConsumableProps {
  /** The type of the consumable. */
  type: DeviceConsumableType;
  /** The minutes used of the consumable. */
  minutesUsed: number;
}

/** Describe a device consumable. */
export class DeviceConsumable extends ValueObject<DeviceConsumableProps> {
  /** Returns the type of the consumable. */
  get type(): DeviceConsumableType {
    return this.props.type;
  }

  /** Returns the minutes used of the consumable. */
  get minutesUsed(): number {
    return this.props.minutesUsed;
  }

  protected validate(props: DeviceConsumableProps): void {
    const keys: (keyof DeviceConsumableProps)[] = ['type', 'minutesUsed'];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (!Object.values(DeviceConsumableType).includes(props.type)) {
      throw new ArgumentInvalidException(
        `Value '${props.type}' for property 'type' for ${this.constructor.name} is invalid`,
      );
    }

    if (typeof props.minutesUsed !== 'number') {
      throw new ArgumentInvalidException(
        `Value '${props.minutesUsed as string}' for property 'minutesUsed' for ${
          this.constructor.name
        } is not a number`,
      );
    }
  }
}
