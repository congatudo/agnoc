import { Command, ID } from '@agnoc/toolkit';
import { QuietHoursSetting } from '../value-objects/quiet-hours-setting.value-object';

/** Input for the command setting the quiet hours of a device. */
export interface SetDeviceQuietHoursCommandInput {
  /** ID of the device to set the quiet hours for. */
  deviceId: ID;
  /** Quiet hours to set. */
  quietHours: QuietHoursSetting;
}

/** Command that sets the quiet hours of a device. */
export class SetDeviceQuietHoursCommand extends Command<SetDeviceQuietHoursCommandInput, void> {
  /** Returns the ID of the device to set the quiet hours for. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the quiet hours to set. */
  get quietHours(): QuietHoursSetting {
    return this.props.quietHours;
  }

  protected validate(props: SetDeviceQuietHoursCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'quietHours');
    this.validateInstanceProp(props, 'quietHours', QuietHoursSetting);
  }
}
