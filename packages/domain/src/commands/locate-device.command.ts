import { Command } from '@agnoc/toolkit';
import type { ID } from '@agnoc/toolkit';

export interface LocateDeviceCommandProps {
  deviceId: ID;
}

export class LocateDeviceCommand extends Command<LocateDeviceCommandProps> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(_: LocateDeviceCommandProps): void {
    // noop
  }
}
