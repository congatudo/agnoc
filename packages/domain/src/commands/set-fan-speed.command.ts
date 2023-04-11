import { Command, ID } from '@agnoc/toolkit';
import { DeviceFanSpeed } from '../domain-primitives/device-fan-speed.domain-primitive';

/** Input for the command stopping the cleaning process of a device. */
export interface SetFanSpeedCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Fan speed setting. */
  fanSpeed: DeviceFanSpeed;
}

/** Command for stopping the cleaning process of a device. */
export class SetFanSpeedCommand extends Command<SetFanSpeedCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the fan speed. */
  get fanSpeed(): DeviceFanSpeed {
    return this.props.fanSpeed;
  }

  protected validate(props: SetFanSpeedCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'fanSpeed');
    this.validateInstanceProp(props, 'fanSpeed', DeviceFanSpeed);
  }
}
