import { Command, ID } from '@agnoc/toolkit';

/** Input for the command locating a device. */
export interface LocateDeviceCommandInput {
  /** ID of the device to locate. */
  deviceId: ID;
}

/** Command that locates a device. */
export class LocateDeviceCommand extends Command<LocateDeviceCommandInput, void> {
  /** Returns the ID of the device to locate. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: LocateDeviceCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }
}
