import type { FindDeviceQuery } from './find-device.query';

export type Queries = {
  FindDeviceQuery: FindDeviceQuery;
};

export type QueryNames = keyof Queries;
