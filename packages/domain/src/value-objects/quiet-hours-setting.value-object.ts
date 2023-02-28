import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
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
    const keys = ['isEnabled', 'beginTime', 'endTime'] as (keyof QuietHoursSettingProps)[];

    keys.forEach((prop) => {
      if (!isPresent(props[prop])) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (typeof props.isEnabled !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.isEnabled as string}' for property 'isEnabled' for ${this.constructor.name} is not a boolean`,
      );
    }

    if (!(props.beginTime instanceof DeviceTime)) {
      throw new ArgumentInvalidException(
        `Value '${props.beginTime as string}' for property 'beginTime' for ${this.constructor.name} is not a ${
          DeviceTime.name
        }`,
      );
    }

    if (!(props.endTime instanceof DeviceTime)) {
      throw new ArgumentInvalidException(
        `Value '${props.endTime as string}' for property 'endTime' for ${this.constructor.name} is not a ${
          DeviceTime.name
        }`,
      );
    }
  }
}
