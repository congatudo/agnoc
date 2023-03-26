import { DomainEvent } from '@agnoc/toolkit';
import { DeviceSettings } from '../value-objects/device-settings.value-object';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceSettingsChangedDomainEventProps extends DomainEventProps {
  previousSettings?: DeviceSettings;
  currentSettings: DeviceSettings;
}

export class DeviceSettingsChangedDomainEvent extends DomainEvent<DeviceSettingsChangedDomainEventProps> {
  get previousSettings(): DeviceSettings | undefined {
    return this.props.previousSettings;
  }

  get currentSettings(): DeviceSettings {
    return this.props.currentSettings;
  }

  protected validate(props: DeviceSettingsChangedDomainEventProps): void {
    if (props.previousSettings) {
      this.validateInstanceProp(props, 'previousSettings', DeviceSettings);
    }

    this.validateDefinedProp(props, 'currentSettings');
    this.validateInstanceProp(props, 'currentSettings', DeviceSettings);
  }
}
