import { ID, Entity, ArgumentNotProvidedException, isPresent, ArgumentInvalidException } from '@agnoc/toolkit';
import { CleanMode } from '../domain-primitives/clean-mode.domain-primitive';
import { DeviceFanSpeed } from '../domain-primitives/device-fan-speed.domain-primitive';
import { DeviceWaterLevel } from '../domain-primitives/device-water-level.domain-primitive';
import { DeviceTime } from '../value-objects/device-time.value-object';
import type { WeekDay } from '../domain-primitives/week-day.domain-primitive';

export interface DeviceOrderProps {
  id: ID;
  mapId: ID;
  planId: ID;
  isEnabled: boolean;
  isRepeatable: boolean;
  isDeepClean: boolean;
  weekDayList: WeekDay[];
  time: DeviceTime;
  cleanMode: CleanMode;
  fanSpeed: DeviceFanSpeed;
  waterLevel: DeviceWaterLevel;
}

export class DeviceOrder extends Entity<DeviceOrderProps> {
  override get id(): ID {
    return this.props.id;
  }

  get mapId(): ID {
    return this.props.mapId;
  }

  get planId(): ID {
    return this.props.planId;
  }

  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  get isRepeatable(): boolean {
    return this.props.isRepeatable;
  }

  get isDeepClean(): boolean {
    return this.props.isDeepClean;
  }

  get weekDayList(): WeekDay[] {
    return this.props.weekDayList;
  }

  get time(): DeviceTime {
    return this.props.time;
  }

  get cleanMode(): CleanMode {
    return this.props.cleanMode;
  }

  get fanSpeed(): DeviceFanSpeed {
    return this.props.fanSpeed;
  }

  get waterLevel(): DeviceWaterLevel {
    return this.props.waterLevel;
  }

  protected validate(props: DeviceOrderProps): void {
    if (
      ![
        props.id,
        props.mapId,
        props.planId,
        props.isEnabled,
        props.isRepeatable,
        props.isDeepClean,
        props.weekDayList,
        props.time,
        props.cleanMode,
        props.fanSpeed,
        props.waterLevel,
      ].every(isPresent)
    ) {
      throw new ArgumentNotProvidedException('Missing property in device order constructor');
    }

    if (!(props.id instanceof ID)) {
      throw new ArgumentInvalidException('Invalid id in device order constructor');
    }

    if (!(props.mapId instanceof ID)) {
      throw new ArgumentInvalidException('Invalid mapId in device order constructor');
    }

    if (!(props.planId instanceof ID)) {
      throw new ArgumentInvalidException('Invalid planId in device order constructor');
    }

    if (!(props.time instanceof DeviceTime)) {
      throw new ArgumentInvalidException('Invalid time in device order constructor');
    }

    if (!(props.cleanMode instanceof CleanMode)) {
      throw new ArgumentInvalidException('Invalid cleanMode in device order constructor');
    }

    if (!(props.fanSpeed instanceof DeviceFanSpeed)) {
      throw new ArgumentInvalidException('Invalid property fanSpeed in device order constructor');
    }

    if (!(props.waterLevel instanceof DeviceWaterLevel)) {
      throw new ArgumentInvalidException('Invalid property waterLevel in device order constructor');
    }
  }
}
