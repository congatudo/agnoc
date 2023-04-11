import { ID, Query } from '@agnoc/toolkit';
import { DeviceConsumable } from '../value-objects/device-consumable.value-object';

export interface GetDeviceConsumablesQueryInput {
  deviceId: ID;
}

export interface GetDeviceConsumablesQueryOutput {
  consumables: DeviceConsumable[];
}

export class GetDeviceConsumablesQuery extends Query<GetDeviceConsumablesQueryInput, GetDeviceConsumablesQueryOutput> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: GetDeviceConsumablesQueryInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }

  override validateOutput(output: GetDeviceConsumablesQueryOutput): void {
    this.validateDefinedProp(output, 'consumables');
    this.validateArrayProp(output, 'consumables', DeviceConsumable);
  }
}
