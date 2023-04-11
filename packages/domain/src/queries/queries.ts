import { FindDeviceQuery } from './find-device.query';
import { FindDevicesQuery } from './find-devices.query';
import { GetDeviceConsumablesQuery } from './get-device-consumables.query';
import type { InstanceTypeProps } from '@agnoc/toolkit';

export const Queries = {
  FindDeviceQuery,
  FindDevicesQuery,
  GetDeviceConsumablesQuery,
};

export type Queries = InstanceTypeProps<typeof Queries>;

export type QueryNames = keyof Queries;
