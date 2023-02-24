import { DeviceOrder, CLEAN_MODE, DeviceTime, DeviceWaterLevel, DeviceWaterLevelValue } from '@agnoc/domain';
import { ArgumentNotProvidedException, ID } from '@agnoc/toolkit';
import type { DeviceFanSpeedMapper } from './device-fan-speed.mapper';
import type { DeviceWaterLevelMapper } from './device-water-level.mapper';
import type { IDEVICE_ORDERLIST_SETTING_REQ } from '../../schemas/schema';
import type { DeviceOrderProps, CleanMode } from '@agnoc/domain';
import type { Mapper } from '@agnoc/toolkit';

export class DeviceOrderMapper implements Mapper<DeviceOrder, IDEVICE_ORDERLIST_SETTING_REQ> {
  constructor(
    private readonly deviceFanSpeedMapper: DeviceFanSpeedMapper,
    private readonly deviceWaterLevelMapper: DeviceWaterLevelMapper,
  ) {}

  toDomain(orderList: IDEVICE_ORDERLIST_SETTING_REQ): DeviceOrder {
    if (!orderList.cleanInfo) {
      throw new ArgumentNotProvidedException('Unable to read clean info from order list');
    }

    const time = DeviceTime.fromMinutes(orderList.dayTime);
    const props: DeviceOrderProps = {
      id: new ID(orderList.orderId),
      mapId: new ID(orderList.cleanInfo.mapHeadId),
      planId: new ID(orderList.cleanInfo.planId),
      isEnabled: orderList.enable,
      isRepeatable: orderList.enable,
      isDeepClean: orderList.cleanInfo.twiceClean,
      weekDay: orderList.weekDay,
      time,
      cleanMode: CLEAN_MODE[orderList.cleanInfo.cleanMode] as CleanMode,
      fanSpeed: this.deviceFanSpeedMapper.toDomain(orderList.cleanInfo.windPower),
      waterLevel: orderList.cleanInfo.waterLevel
        ? this.deviceWaterLevelMapper.toDomain(orderList.cleanInfo.waterLevel)
        : new DeviceWaterLevel({ value: DeviceWaterLevelValue.Off }),
    };

    return new DeviceOrder(props);
  }

  fromDomain(deviceOrder: DeviceOrder): IDEVICE_ORDERLIST_SETTING_REQ {
    const orderList: IDEVICE_ORDERLIST_SETTING_REQ = {
      orderId: deviceOrder.id.value,
      enable: deviceOrder.isEnabled,
      repeat: deviceOrder.isRepeatable,
      weekDay: deviceOrder.weekDay,
      dayTime: deviceOrder.time.toMinutes(),
      cleanInfo: {
        mapHeadId: deviceOrder.mapId.value,
        planId: deviceOrder.planId.value,
        cleanMode: CLEAN_MODE[deviceOrder.cleanMode],
        windPower: this.deviceFanSpeedMapper.fromDomain(deviceOrder.fanSpeed),
        waterLevel: this.deviceWaterLevelMapper.fromDomain(deviceOrder.waterLevel),
        twiceClean: deviceOrder.isDeepClean,
      },
    };

    return orderList;
  }
}