import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

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
    if (!isPresent(props.isEnabled)) {
      throw new ArgumentNotProvidedException(`Property 'isEnabled' for device setting not provided`);
    }

    if (typeof props.isEnabled !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.isEnabled as string}' for property 'isEnabled' for device setting is not a boolean`,
      );
    }
  }
}
