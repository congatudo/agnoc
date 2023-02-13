import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

export enum DeviceConsumableType {
  MainBrush = 'mainBrush',
  SideBrush = 'sideBrush',
  Filter = 'filter',
  Dishcloth = 'dishcloth',
}

export interface DeviceConsumableProps {
  type: DeviceConsumableType;
  used: number;
}

export class DeviceConsumable extends ValueObject<DeviceConsumableProps> {
  get type(): DeviceConsumableType {
    return this.props.type;
  }

  get used(): number {
    return this.props.used;
  }

  protected validate(props: DeviceConsumableProps): void {
    if (![props.type, props.used].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device consumable constructor');
    }

    if (!Object.values(DeviceConsumableType).includes(props.type)) {
      throw new ArgumentInvalidException('Invalid property type in device consumable constructor');
    }
  }
}
