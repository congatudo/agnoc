import { ID, Entity } from '@agnoc/toolkit';
import { CleanMode } from '../domain-primitives/clean-mode.domain-primitive';
import { DeviceFanSpeed } from '../domain-primitives/device-fan-speed.domain-primitive';
import { DeviceWaterLevel } from '../domain-primitives/device-water-level.domain-primitive';
import { WeekDay } from '../domain-primitives/week-day.domain-primitive';
import { DeviceTime } from '../value-objects/device-time.value-object';
import type { EntityProps } from '@agnoc/toolkit';

/** Describes the properties of a device order. */
export interface DeviceOrderProps extends EntityProps {
  /** The map id. */
  mapId: ID;
  /** The plan id. */
  planId: ID;
  /** Whenether the device order is enabled. */
  isEnabled: boolean;
  /** Whenether the device order is repeatable. */
  isRepeatable: boolean;
  /** Whenether the device order is a deep clean. */
  isDeepClean: boolean;
  /** The week days when the device order is executed. */
  weekDays: WeekDay[];
  /** The time when the device order is executed. */
  time: DeviceTime;
  /** The clean mode. */
  cleanMode: CleanMode;
  /** The fan speed. */
  fanSpeed: DeviceFanSpeed;
  /** The water level. */
  waterLevel: DeviceWaterLevel;
}

/** Describes a device order. */
export class DeviceOrder extends Entity<DeviceOrderProps> {
  /** Returns the map id. */
  get mapId(): ID {
    return this.props.mapId;
  }

  /** Returns the plan id. */
  get planId(): ID {
    return this.props.planId;
  }

  /** Returns whenether the device order is enabled. */
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  /** Returns whenether the device order is repeatable. */
  get isRepeatable(): boolean {
    return this.props.isRepeatable;
  }

  /** Returns whenether the device order is a deep clean. */
  get isDeepClean(): boolean {
    return this.props.isDeepClean;
  }

  /** Returns the week days when the device order is executed. */
  get weekDays(): WeekDay[] {
    return this.props.weekDays;
  }

  /** Returns the time when the device order is executed. */
  get time(): DeviceTime {
    return this.props.time;
  }

  /** Returns the clean mode. */
  get cleanMode(): CleanMode {
    return this.props.cleanMode;
  }

  /** Returns the fan speed. */
  get fanSpeed(): DeviceFanSpeed {
    return this.props.fanSpeed;
  }

  /** Returns the water level. */
  get waterLevel(): DeviceWaterLevel {
    return this.props.waterLevel;
  }

  protected validate(props: DeviceOrderProps): void {
    const keys: (keyof DeviceOrderProps)[] = [
      'mapId',
      'planId',
      'isEnabled',
      'isRepeatable',
      'isDeepClean',
      'weekDays',
      'time',
      'cleanMode',
      'fanSpeed',
      'waterLevel',
    ];

    keys.forEach((prop) => {
      this.validateDefinedProp(props, prop);
    });

    this.validateInstanceProp(props, 'mapId', ID);
    this.validateInstanceProp(props, 'planId', ID);
    this.validateBooleanProp(props, 'isEnabled');
    this.validateBooleanProp(props, 'isRepeatable');
    this.validateBooleanProp(props, 'isDeepClean');
    this.validateArrayProp(props, 'weekDays', WeekDay);
    this.validateInstanceProp(props, 'time', DeviceTime);
    this.validateInstanceProp(props, 'cleanMode', CleanMode);
    this.validateInstanceProp(props, 'fanSpeed', DeviceFanSpeed);
    this.validateInstanceProp(props, 'waterLevel', DeviceWaterLevel);
  }
}
