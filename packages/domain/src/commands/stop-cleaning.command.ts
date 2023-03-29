import { Command, ID } from '@agnoc/toolkit';

/** Input for the command stopping the cleaning process of a device. */
export interface StopCleaningCommandInput {
  /** ID of the device. */
  deviceId: ID;
}

/** Command for stopping the cleaning process of a device. */
export class StopCleaningCommand extends Command<StopCleaningCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: StopCleaningCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }
}
