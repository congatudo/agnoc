import { ValueObject } from '@agnoc/toolkit';
import { DeviceTime } from './device-time.value-object';

/** Describe the props of a device quiet hours. */
export interface QuietHoursSettingProps {
  /** Whether quiet hours are enabled. */
  isEnabled: boolean;
  /** The begin time of quiet hours. */
  beginTime: DeviceTime;
  /** The end time of quiet hours. */
  endTime: DeviceTime;
}

/** Describe the quiet hours of a device. */
export class QuietHoursSetting extends ValueObject<QuietHoursSettingProps> {
  /** Returns whether quiet hours are enabled. */
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  /** Returns the begin time of quiet hours. */
  get beginTime(): DeviceTime {
    return this.props.beginTime;
  }

  /** Returns the end time of quiet hours. */
  get endTime(): DeviceTime {
    return this.props.endTime;
  }

  protected validate(props: QuietHoursSettingProps): void {
    const keys: (keyof QuietHoursSettingProps)[] = ['isEnabled', 'beginTime', 'endTime'];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateTypeProp(props, 'isEnabled', 'boolean');
    this.validateInstanceProp(props, 'beginTime', DeviceTime);
    this.validateInstanceProp(props, 'endTime', DeviceTime);
  }
}
