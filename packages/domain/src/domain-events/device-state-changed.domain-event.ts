import { DomainEvent } from '@agnoc/toolkit';
import { DeviceState } from '../domain-primitives/device-state.domain-primitive';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceStateChangedDomainEventProps extends DomainEventProps {
  previousState?: DeviceState;
  currentState: DeviceState;
}

export class DeviceStateChangedDomainEvent extends DomainEvent<DeviceStateChangedDomainEventProps> {
  get previousState(): DeviceState | undefined {
    return this.props.previousState;
  }

  get currentState(): DeviceState {
    return this.props.currentState;
  }

  protected validate(props: DeviceStateChangedDomainEventProps): void {
    if (props.previousState) {
      this.validateInstanceProp(props, 'previousState', DeviceState);
    }

    this.validateDefinedProp(props, 'currentState');
    this.validateInstanceProp(props, 'currentState', DeviceState);
  }
}
