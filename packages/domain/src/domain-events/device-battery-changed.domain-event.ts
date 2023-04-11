import { DomainEvent } from '@agnoc/toolkit';
import { DeviceBattery } from '../domain-primitives/device-battery.domain-primitive';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceBatteryChangedDomainEventProps extends DomainEventProps {
  previousBattery: DeviceBattery;
  currentBattery: DeviceBattery;
}

export class DeviceBatteryChangedDomainEvent extends DomainEvent<DeviceBatteryChangedDomainEventProps> {
  get previousBattery(): DeviceBattery {
    return this.props.previousBattery;
  }

  get currentBattery(): DeviceBattery {
    return this.props.currentBattery;
  }

  protected validate(props: DeviceBatteryChangedDomainEventProps): void {
    this.validateDefinedProp(props, 'previousBattery');
    this.validateInstanceProp(props, 'previousBattery', DeviceBattery);
    this.validateDefinedProp(props, 'currentBattery');
    this.validateInstanceProp(props, 'currentBattery', DeviceBattery);
  }
}
