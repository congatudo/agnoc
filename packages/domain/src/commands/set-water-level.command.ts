import { Command, ID } from '@agnoc/toolkit';
import { DeviceWaterLevel } from '../domain-primitives/device-water-level.domain-primitive';

/** Input for the command stopping the cleaning process of a device. */
export interface SetWaterLevelCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Fan speed setting. */
  waterLevel: DeviceWaterLevel;
}

/** Command for stopping the cleaning process of a device. */
export class SetWaterLevelCommand extends Command<SetWaterLevelCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the fan speed. */
  get waterLevel(): DeviceWaterLevel {
    return this.props.waterLevel;
  }

  protected validate(props: SetWaterLevelCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'waterLevel');
    this.validateInstanceProp(props, 'waterLevel', DeviceWaterLevel);
  }
}
