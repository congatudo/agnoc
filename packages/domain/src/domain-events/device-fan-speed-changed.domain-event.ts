import { DomainEvent } from '@agnoc/toolkit';
import { DeviceFanSpeed } from '../domain-primitives/device-fan-speed.domain-primitive';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceFanSpeedChangedDomainEventProps extends DomainEventProps {
  previousFanSpeed?: DeviceFanSpeed;
  currentFanSpeed: DeviceFanSpeed;
}

export class DeviceFanSpeedChangedDomainEvent extends DomainEvent<DeviceFanSpeedChangedDomainEventProps> {
  get previousFanSpeed(): DeviceFanSpeed | undefined {
    return this.props.previousFanSpeed;
  }

  get currentFanSpeed(): DeviceFanSpeed {
    return this.props.currentFanSpeed;
  }

  protected validate(props: DeviceFanSpeedChangedDomainEventProps): void {
    if (props.previousFanSpeed) {
      this.validateInstanceProp(props, 'previousFanSpeed', DeviceFanSpeed);
    }

    this.validateDefinedProp(props, 'currentFanSpeed');
    this.validateInstanceProp(props, 'currentFanSpeed', DeviceFanSpeed);
  }
}
