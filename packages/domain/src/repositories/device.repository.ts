import { Repository } from '@agnoc/toolkit';
import type { Device } from '../aggregate-roots/device.aggregate-root';

export class DeviceRepository extends Repository<Device> {}
