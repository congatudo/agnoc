import { Command, ID } from '@agnoc/toolkit';

/** Input for the command pausing the cleaning process of a device. */
export interface PauseCleaningCommandInput {
  /** ID of the device. */
  deviceId: ID;
}

/** Command for pausing the cleaning process of a device. */
export class PauseCleaningCommand extends Command<PauseCleaningCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: PauseCleaningCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }
}
