import { Command, ID } from '@agnoc/toolkit';

/** Input for the command starting the cleaning process of a device. */
export interface StartCleaningCommandInput {
  /** ID of the device. */
  deviceId: ID;
}

/** Command for starting the cleaning process of a device. */
export class StartCleaningCommand extends Command<StartCleaningCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: StartCleaningCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }
}
