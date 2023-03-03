import { DeviceOrder, DeviceTime, DeviceWaterLevel, DeviceWaterLevelValue } from '@agnoc/domain';
import { ArgumentNotProvidedException, ID } from '@agnoc/toolkit';
import type { CleanModeMapper } from './clean-mode.mapper';
import type { DeviceFanSpeedMapper } from './device-fan-speed.mapper';
import type { DeviceWaterLevelMapper } from './device-water-level.mapper';
import type { WeekDayListMapper } from './week-day-list.mapper';
import type { DeviceOrderProps } from '@agnoc/domain';
import type { IDEVICE_ORDERLIST_SETTING_REQ } from '@agnoc/schemas-tcp';
import type { Mapper } from '@agnoc/toolkit';

export class DeviceOrderMapper implements Mapper<DeviceOrder, IDEVICE_ORDERLIST_SETTING_REQ> {
  constructor(
    private readonly deviceFanSpeedMapper: DeviceFanSpeedMapper,
    private readonly deviceWaterLevelMapper: DeviceWaterLevelMapper,
    private readonly cleanModeMapper: CleanModeMapper,
    private readonly weekDayListMapper: WeekDayListMapper,
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
      weekDayList: this.weekDayListMapper.toDomain(orderList.weekDay),
      time,
      cleanMode: this.cleanModeMapper.toDomain(orderList.cleanInfo.cleanMode),
      fanSpeed: this.deviceFanSpeedMapper.toDomain(orderList.cleanInfo.windPower),
      waterLevel: orderList.cleanInfo.waterLevel
        ? this.deviceWaterLevelMapper.toDomain(orderList.cleanInfo.waterLevel)
        : new DeviceWaterLevel(DeviceWaterLevelValue.Off),
    };

    return new DeviceOrder(props);
  }

  fromDomain(deviceOrder: DeviceOrder): IDEVICE_ORDERLIST_SETTING_REQ {
    const orderList: IDEVICE_ORDERLIST_SETTING_REQ = {
      orderId: deviceOrder.id.value,
      enable: deviceOrder.isEnabled,
      repeat: deviceOrder.isRepeatable,
      weekDay: this.weekDayListMapper.fromDomain(deviceOrder.weekDayList),
      dayTime: deviceOrder.time.toMinutes(),
      cleanInfo: {
        mapHeadId: deviceOrder.mapId.value,
        planId: deviceOrder.planId.value,
        cleanMode: this.cleanModeMapper.fromDomain(deviceOrder.cleanMode),
        windPower: this.deviceFanSpeedMapper.fromDomain(deviceOrder.fanSpeed),
        waterLevel: this.deviceWaterLevelMapper.fromDomain(deviceOrder.waterLevel),
        twiceClean: deviceOrder.isDeepClean,
      },
    };

    return orderList;
  }
}
