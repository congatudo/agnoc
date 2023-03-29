import { Command, ID } from '@agnoc/toolkit';

/** Input for the command returning a device to its home position. */
export interface ReturnHomeCommandInput {
  /** ID of the device. */
  deviceId: ID;
}

/** Command for returning a device to its home position. */
export class ReturnHomeCommand extends Command<ReturnHomeCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: ReturnHomeCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }
}
