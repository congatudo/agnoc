import { Command } from '@agnoc/toolkit';
import type { ID } from '@agnoc/toolkit';

export interface LocateDeviceCommandInput {
  deviceId: ID;
}

export class LocateDeviceCommand extends Command<LocateDeviceCommandInput, void> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(): void {
    // TODO: validate input
  }
}
