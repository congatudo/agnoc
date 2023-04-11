import { Command, ID } from '@agnoc/toolkit';
import { MapCoordinate } from '../value-objects/map-coordinate.value-object';

/** Input for the command cleaning a spot. */
export interface CleanSpotCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Coordinate of the spot to clean. */
  spot: MapCoordinate;
}

/** Command for starting the cleaning process of a device. */
export class CleanSpotCommand extends Command<CleanSpotCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the position of the spot to clean. */
  get spot(): MapCoordinate {
    return this.props.spot;
  }

  protected validate(props: CleanSpotCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'spot');
    this.validateInstanceProp(props, 'spot', MapCoordinate);
  }
}
