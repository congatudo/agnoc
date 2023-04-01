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
  hoursUsed: number;
}

/** Describe a device consumable. */
export class DeviceConsumable extends ValueObject<DeviceConsumableProps> {
  /** Returns the type of the consumable. */
  get type(): DeviceConsumableType {
    return this.props.type;
  }

  /** Returns the hours used of the consumable. */
  get hoursUsed(): number {
    return this.props.hoursUsed;
  }

  protected validate(props: DeviceConsumableProps): void {
    const keys: (keyof DeviceConsumableProps)[] = ['type', 'hoursUsed'];

    keys.forEach((prop) => this.validateDefinedProp(props, prop));

    this.validateListProp(props, 'type', Object.values(DeviceConsumableType));
    this.validateNumberProp(props, 'hoursUsed');
  }
}
