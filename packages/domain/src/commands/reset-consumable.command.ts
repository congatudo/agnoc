import { Command, ID } from '@agnoc/toolkit';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';

/** Input for the command resetting a consumable. */
export interface ResetConsumableCommandInput {
  /** ID of the device. */
  deviceId: ID;
  /** Consumable to reset. */
  consumable: DeviceConsumable;
}

/** Command that locates a device. */
export class ResetConsumableCommand extends Command<ResetConsumableCommandInput, void> {
  /** Returns the ID of the device. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the consumable to reset. */
  get consumable(): DeviceConsumable {
    return this.props.consumable;
  }

  protected validate(props: ResetConsumableCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'consumable');
    this.validateInstanceProp(props, 'consumable', DeviceConsumable);
  }
}
