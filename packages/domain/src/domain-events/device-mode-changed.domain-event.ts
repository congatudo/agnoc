import { DomainEvent } from '@agnoc/toolkit';
import { DeviceMode } from '../domain-primitives/device-mode.domain-primitive';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceModeChangedDomainEventProps extends DomainEventProps {
  previousMode?: DeviceMode;
  currentMode: DeviceMode;
}

export class DeviceModeChangedDomainEvent extends DomainEvent<DeviceModeChangedDomainEventProps> {
  get previousMode(): DeviceMode | undefined {
    return this.props.previousMode;
  }

  get currentMode(): DeviceMode {
    return this.props.currentMode;
  }

  protected validate(props: DeviceModeChangedDomainEventProps): void {
    if (props.previousMode) {
      this.validateInstanceProp(props, 'previousMode', DeviceMode);
    }

    this.validateDefinedProp(props, 'currentMode');
    this.validateInstanceProp(props, 'currentMode', DeviceMode);
  }
}
