import { DomainEvent } from '@agnoc/toolkit';
import { DeviceError } from '../domain-primitives/device-error.domain-primitive';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceErrorChangedDomainEventProps extends DomainEventProps {
  previousError?: DeviceError;
  currentError: DeviceError;
}

export class DeviceErrorChangedDomainEvent extends DomainEvent<DeviceErrorChangedDomainEventProps> {
  get previousError(): DeviceError | undefined {
    return this.props.previousError;
  }

  get currentError(): DeviceError {
    return this.props.currentError;
  }

  protected validate(props: DeviceErrorChangedDomainEventProps): void {
    if (props.previousError) {
      this.validateInstanceProp(props, 'previousError', DeviceError);
    }

    this.validateDefinedProp(props, 'currentError');
    this.validateInstanceProp(props, 'currentError', DeviceError);
  }
}
