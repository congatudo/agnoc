import { DeviceOrder, DeviceOrderProps, CLEAN_MODE, CleanMode, DeviceTime, DeviceWaterLevel } from '@agnoc/domain';
import { Mapper, ArgumentNotProvidedException, ID } from '@agnoc/toolkit';
import { IDEVICE_ORDERLIST_SETTING_REQ } from '../../schemas/schema';
import { DeviceFanSpeedMapper } from './device-fan-speed.mapper';
import { DeviceWaterLevelMapper } from './device-water-level.mapper';

export const DeviceOrderMapper: Mapper<DeviceOrder, IDEVICE_ORDERLIST_SETTING_REQ> = class {
  static toDomain(orderList: IDEVICE_ORDERLIST_SETTING_REQ): DeviceOrder {
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
      fanSpeed: DeviceFanSpeedMapper.toDomain(orderList.cleanInfo.windPower),
      waterLevel: orderList.cleanInfo.waterLevel
        ? DeviceWaterLevelMapper.toDomain(orderList.cleanInfo.waterLevel)
        : new DeviceWaterLevel({ value: DeviceWaterLevel.VALUE.OFF }),
    };

    return new DeviceOrder(props);
  }

  static fromDomain(deviceOrder: DeviceOrder): IDEVICE_ORDERLIST_SETTING_REQ {
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
        windPower: DeviceFanSpeedMapper.fromDomain(deviceOrder.fanSpeed),
        waterLevel: DeviceWaterLevelMapper.fromDomain(deviceOrder.waterLevel),
        twiceClean: deviceOrder.isDeepClean,
      },
    };

    return orderList;
  }
};
