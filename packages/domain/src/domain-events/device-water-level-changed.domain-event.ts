import { DomainEvent } from '@agnoc/toolkit';
import { DeviceWaterLevel } from '../domain-primitives/device-water-level.domain-primitive';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceWaterLevelChangedDomainEventProps extends DomainEventProps {
  previousWaterLevel?: DeviceWaterLevel;
  currentWaterLevel: DeviceWaterLevel;
}

export class DeviceWaterLevelChangedDomainEvent extends DomainEvent<DeviceWaterLevelChangedDomainEventProps> {
  get previousWaterLevel(): DeviceWaterLevel | undefined {
    return this.props.previousWaterLevel;
  }

  get currentWaterLevel(): DeviceWaterLevel {
    return this.props.currentWaterLevel;
  }

  protected validate(props: DeviceWaterLevelChangedDomainEventProps): void {
    if (props.previousWaterLevel) {
      this.validateInstanceProp(props, 'previousWaterLevel', DeviceWaterLevel);
    }

    this.validateDefinedProp(props, 'currentWaterLevel');
    this.validateInstanceProp(props, 'currentWaterLevel', DeviceWaterLevel);
  }
}
