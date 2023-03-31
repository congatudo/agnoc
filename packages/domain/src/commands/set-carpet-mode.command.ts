import { Command, ID } from '@agnoc/toolkit';
import { DeviceSetting } from '../value-objects/device-setting.value-object';

/** Input for the command stopping the cleaning process of a device. */
export interface SetCarpetModeCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Carpet mode setting. */
  carpetMode: DeviceSetting;
}

/** Command for stopping the cleaning process of a device. */
export class SetCarpetModeCommand extends Command<SetCarpetModeCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the carpet mode setting. */
  get carpetMode(): DeviceSetting {
    return this.props.carpetMode;
  }

  protected validate(props: SetCarpetModeCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'carpetMode');
    this.validateInstanceProp(props, 'carpetMode', DeviceSetting);
  }
}
