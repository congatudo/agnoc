import { Command, ID } from '@agnoc/toolkit';
import { QuietHoursSetting } from '../value-objects/quiet-hours-setting.value-object';

export interface SetDeviceQuietHoursCommandInput {
  deviceId: ID;
  quietHours: QuietHoursSetting;
}

export class SetDeviceQuietHoursCommand extends Command<SetDeviceQuietHoursCommandInput, void> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

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
