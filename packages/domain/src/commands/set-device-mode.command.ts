import { Command, ID } from '@agnoc/toolkit';
import { DeviceMode } from '../domain-primitives/device-mode.domain-primitive';

/** Input for the command setting the mode of a device. */
export interface SetDeviceModeCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Device mode setting. */
  mode: DeviceMode;
}

/** Command for stopping the cleaning process of a device. */
export class SetDeviceModeCommand extends Command<SetDeviceModeCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the device mode setting. */
  get mode(): DeviceMode {
    return this.props.mode;
  }

  protected validate(props: SetDeviceModeCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'mode');
    this.validateInstanceProp(props, 'mode', DeviceMode);
  }
}
