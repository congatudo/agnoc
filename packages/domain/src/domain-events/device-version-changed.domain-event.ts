import { DomainEvent } from '@agnoc/toolkit';
import { DeviceVersion } from '../value-objects/device-version.value-object';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceVersionChangedDomainEventProps extends DomainEventProps {
  previousVersion: DeviceVersion;
  currentVersion: DeviceVersion;
}

export class DeviceVersionChangedDomainEvent extends DomainEvent<DeviceVersionChangedDomainEventProps> {
  get previousVersion(): DeviceVersion {
    return this.props.previousVersion;
  }

  get currentVersion(): DeviceVersion {
    return this.props.currentVersion;
  }

  protected validate(props: DeviceVersionChangedDomainEventProps): void {
    this.validateDefinedProp(props, 'previousVersion');
    this.validateInstanceProp(props, 'previousVersion', DeviceVersion);
    this.validateDefinedProp(props, 'currentVersion');
    this.validateInstanceProp(props, 'currentVersion', DeviceVersion);
  }
}
