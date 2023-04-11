import { FindDeviceQuery } from './find-device.query';
import { GetDeviceConsumablesQuery } from './get-device-consumables.query';
import type { InstanceTypeProps } from '@agnoc/toolkit';

export const Queries = {
  FindDeviceQuery,
  GetDeviceConsumablesQuery,
};

export type Queries = InstanceTypeProps<typeof Queries>;

export type QueryNames = keyof Queries;
