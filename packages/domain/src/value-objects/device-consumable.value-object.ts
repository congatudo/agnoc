import { ValueObject } from '@agnoc/toolkit';

/** Describe the type of a device consumable. */
export enum DeviceConsumableType {
  MainBrush = 'MainBrush',
  SideBrush = 'SideBrush',
  Filter = 'Filter',
  Dishcloth = 'Dishcloth',
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

    keys.forEach((prop) => this.validateDefinedProp(props, prop));

    this.validateListProp(props, 'type', Object.values(DeviceConsumableType));
    this.validateNumberProp(props, 'minutesUsed');
  }
}
