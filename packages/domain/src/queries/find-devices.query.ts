import { Query } from '@agnoc/toolkit';
import { Device } from '../aggregate-roots/device.aggregate-root';

export interface FindDevicesQueryOutput {
  devices: Device[];
}

export class FindDevicesQuery extends Query<void, FindDevicesQueryOutput> {
  protected validate(): void {
    // noop
  }

  override validateOutput(output: FindDevicesQueryOutput): void {
    this.validateDefinedProp(output, 'devices');
    this.validateArrayProp(output, 'devices', Device);
  }
}
