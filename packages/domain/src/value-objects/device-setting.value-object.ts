import { ValueObject } from '@agnoc/toolkit';

/** The properties of the device setting. */
export interface DeviceSettingProps {
  /** Whether the setting is enabled. */
  isEnabled: boolean;
}

/** Describe the voice setting of a device. */
export class DeviceSetting extends ValueObject<DeviceSettingProps> {
  /** Returns whether the setting is enabled. */
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  protected validate(props: DeviceSettingProps): void {
    this.validateDefinedProp(props, 'isEnabled');
    this.validateBooleanProp(props, 'isEnabled');
  }
}
