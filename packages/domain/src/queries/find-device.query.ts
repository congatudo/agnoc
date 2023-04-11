import { ID, Query } from '@agnoc/toolkit';
import { Device } from '../aggregate-roots/device.aggregate-root';

export interface FindDeviceQueryInput {
  deviceId: ID;
}

export interface FindDeviceQueryOutput {
  device: Device;
}

export class FindDeviceQuery extends Query<FindDeviceQueryInput, FindDeviceQueryOutput> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

  protected validate(props: FindDeviceQueryInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
  }

  override validateOutput(output: FindDeviceQueryOutput): void {
    this.validateDefinedProp(output, 'device');
    this.validateInstanceProp(output, 'device', Device);
  }
}
