import { ID, Entity, ArgumentNotProvidedException, isPresent, ArgumentInvalidException } from '@agnoc/toolkit';
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
      const value = props[prop];

      if (!isPresent(value)) {
        throw new ArgumentNotProvidedException(`Property '${prop}' for ${this.constructor.name} not provided`);
      }
    });

    if (!(props.mapId instanceof ID)) {
      throw new ArgumentInvalidException(
        `Value '${props.mapId as string}' for property 'mapId' for ${this.constructor.name} is not an ${ID.name}`,
      );
    }

    if (!(props.planId instanceof ID)) {
      throw new ArgumentInvalidException(
        `Value '${props.planId as string}' for property 'planId' for ${this.constructor.name} is not an ${ID.name}`,
      );
    }

    if (typeof props.isEnabled !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.isEnabled as string}' for property 'isEnabled' for ${this.constructor.name} is not a boolean`,
      );
    }

    if (typeof props.isRepeatable !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.isRepeatable as string}' for property 'isRepeatable' for ${
          this.constructor.name
        } is not a boolean`,
      );
    }

    if (typeof props.isDeepClean !== 'boolean') {
      throw new ArgumentInvalidException(
        `Value '${props.isDeepClean as string}' for property 'isDeepClean' for ${
          this.constructor.name
        } is not a boolean`,
      );
    }

    if (!Array.isArray(props.weekDays)) {
      throw new ArgumentInvalidException(
        `Value '${props.weekDays as string}' for property 'weekDays' for ${this.constructor.name} is not an array of ${
          WeekDay.name
        }`,
      );
    }

    if (!props.weekDays.every((item) => item instanceof WeekDay)) {
      throw new ArgumentInvalidException(
        `Value '${props.weekDays.join(', ')}' for property 'weekDays' for ${this.constructor.name} is not an array of ${
          WeekDay.name
        }`,
      );
    }

    if (!(props.time instanceof DeviceTime)) {
      throw new ArgumentInvalidException(
        `Value '${props.time as string}' for property 'time' for ${this.constructor.name} is not a ${DeviceTime.name}`,
      );
    }

    if (!(props.cleanMode instanceof CleanMode)) {
      throw new ArgumentInvalidException(
        `Value '${props.cleanMode as string}' for property 'cleanMode' for ${this.constructor.name} is not a ${
          CleanMode.name
        }`,
      );
    }

    if (!(props.fanSpeed instanceof DeviceFanSpeed)) {
      throw new ArgumentInvalidException(
        `Value '${props.fanSpeed as string}' for property 'fanSpeed' for ${this.constructor.name} is not a ${
          DeviceFanSpeed.name
        }`,
      );
    }

    if (!(props.waterLevel instanceof DeviceWaterLevel)) {
      throw new ArgumentInvalidException(
        `Value '${props.waterLevel as string}' for property 'waterLevel' for ${this.constructor.name} is not a ${
          DeviceWaterLevel.name
        }`,
      );
    }
  }
}
