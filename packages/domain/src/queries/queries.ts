import type { FindDeviceQuery } from './find-device.query';
import type { GetDeviceConsumablesQuery } from './get-device-consumables.query';

export type Queries = {
  FindDeviceQuery: FindDeviceQuery;
  GetDeviceConsumablesQuery: GetDeviceConsumablesQuery;
};

export type QueryNames = keyof Queries;
