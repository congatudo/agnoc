import { Command, ID } from '@agnoc/toolkit';

export interface LocateDeviceCommandInput {
  deviceId: ID;
}

export class LocateDeviceCommand extends Command<LocateDeviceCommandInput, void> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: LocateDeviceCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }
}
