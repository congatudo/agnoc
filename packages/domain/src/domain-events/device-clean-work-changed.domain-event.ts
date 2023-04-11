import { DomainEvent } from '@agnoc/toolkit';
import { DeviceCleanWork } from '../value-objects/device-clean-work.value-object';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceCleanWorkChangedDomainEventProps extends DomainEventProps {
  previousCleanWork?: DeviceCleanWork;
  currentCleanWork: DeviceCleanWork;
}

export class DeviceCleanWorkChangedDomainEvent extends DomainEvent<DeviceCleanWorkChangedDomainEventProps> {
  get previousCleanWork(): DeviceCleanWork | undefined {
    return this.props.previousCleanWork;
  }

  get currentCleanWork(): DeviceCleanWork {
    return this.props.currentCleanWork;
  }

  protected validate(props: DeviceCleanWorkChangedDomainEventProps): void {
    if (props.previousCleanWork) {
      this.validateInstanceProp(props, 'previousCleanWork', DeviceCleanWork);
    }

    this.validateDefinedProp(props, 'currentCleanWork');
    this.validateInstanceProp(props, 'currentCleanWork', DeviceCleanWork);
  }
}
