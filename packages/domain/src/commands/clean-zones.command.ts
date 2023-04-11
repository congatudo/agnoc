import { Command, ID } from '@agnoc/toolkit';
import { Zone } from '../entities/zone.entity';

/** Input for the command cleaning zones. */
export interface CleanZonesCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Zones to clean. */
  zones: Zone[];
}

/** Command for starting the cleaning process of a device. */
export class CleanZonesCommand extends Command<CleanZonesCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the zones to clean. */
  get zones(): Zone[] {
    return this.props.zones;
  }

  protected validate(props: CleanZonesCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'zones');
    this.validateArrayProp(props, 'zones', Zone);
  }
}
