import { ID } from '@agnoc/toolkit';
import { CleanMode, CleanModeValue } from './domain-primitives/clean-mode.domain-primitive';
import { CleanSize } from './domain-primitives/clean-size.domain-primitive';
import { DeviceFanSpeed, DeviceFanSpeedValue } from './domain-primitives/device-fan-speed.domain-primitive';
import { DeviceWaterLevel, DeviceWaterLevelValue } from './domain-primitives/device-water-level.domain-primitive';
import { WeekDay, WeekDayValue } from './domain-primitives/week-day.domain-primitive';
import { Room } from './entities/room.entity';
import { Zone } from './entities/zone.entity';
import { DeviceConsumableType } from './value-objects/device-consumable.value-object';
import { DeviceSetting } from './value-objects/device-setting.value-object';
import { DeviceTime } from './value-objects/device-time.value-object';
import { MapCoordinate } from './value-objects/map-coordinate.value-object';
import { MapPixel } from './value-objects/map-pixel.value-object';
import { QuietHoursSetting } from './value-objects/quiet-hours-setting.value-object';
import { VoiceSetting } from './value-objects/voice-setting.value-object';
import type { DeviceMapProps } from './entities/device-map.entity';
import type { DeviceOrderProps } from './entities/device-order.entity';
import type { RoomProps } from './entities/room.entity';
import type { UserProps } from './entities/user.entity';
import type { ZoneProps } from './entities/zone.entity';
import type { DeviceCleanWorkProps } from './value-objects/device-clean-work.value-object';
import type { DeviceConsumableProps } from './value-objects/device-consumable.value-object';
import type { DeviceSettingProps } from './value-objects/device-setting.value-object';
import type { DeviceSettingsProps } from './value-objects/device-settings.value-object';
import type { DeviceTimeProps } from './value-objects/device-time.value-object';
import type { DeviceVersionProps } from './value-objects/device-version.value-object';
import type { DeviceWlanProps } from './value-objects/device-wlan.value-object';
import type { MapCoordinateProps } from './value-objects/map-coordinate.value-object';
import type { MapPixelProps } from './value-objects/map-pixel.value-object';
import type { MapPositionProps } from './value-objects/map-position.value-object';
import type { QuietHoursSettingProps } from './value-objects/quiet-hours-setting.value-object';
import type { VoiceSettingProps } from './value-objects/voice-setting.value-object';

export function givenSomeMapPixelProps(): MapPixelProps {
  return {
    x: 1,
    y: 1,
  };
}

export function givenSomeMapCoordinateProps(): MapCoordinateProps {
  return {
    x: 1,
    y: 1,
  };
}

export function givenSomeMapPositionProps(): MapPositionProps {
  return {
    x: 1,
    y: 1,
    phi: 0,
  };
}

export function givenSomeDeviceTimeProps(): DeviceTimeProps {
  return {
    hours: 1,
    minutes: 2,
  };
}

export function givenSomeDeviceCleanWorkProps(): DeviceCleanWorkProps {
  return {
    size: new CleanSize(1),
    time: new DeviceTime(givenSomeDeviceTimeProps()),
  };
}

export function givenSomeDeviceConsumableProps(): DeviceConsumableProps {
  return {
    type: DeviceConsumableType.MainBrush,
    minutesUsed: 1,
  };
}

export function givenSomeVoiceSettingProps(): VoiceSettingProps {
  return {
    isEnabled: true,
    volume: 50,
  };
}

export function givenSomeQuietHoursSettingProps(): QuietHoursSettingProps {
  return {
    isEnabled: true,
    beginTime: new DeviceTime(givenSomeDeviceTimeProps()),
    endTime: new DeviceTime(givenSomeDeviceTimeProps()),
  };
}

export function givenSomeDeviceSettingProps(): DeviceSettingProps {
  return {
    isEnabled: true,
  };
}

export function givenSomeDeviceSettingsProps(): DeviceSettingsProps {
  return {
    voice: new VoiceSetting(givenSomeVoiceSettingProps()),
    quietHours: new QuietHoursSetting(givenSomeQuietHoursSettingProps()),
    ecoMode: new DeviceSetting(givenSomeDeviceSettingProps()),
    repeatClean: new DeviceSetting(givenSomeDeviceSettingProps()),
    brokenClean: new DeviceSetting(givenSomeDeviceSettingProps()),
    carpetMode: new DeviceSetting(givenSomeDeviceSettingProps()),
    historyMap: new DeviceSetting(givenSomeDeviceSettingProps()),
  };
}

export function givenSomeDeviceVersionProps(): DeviceVersionProps {
  return {
    software: '1.0.0',
    hardware: '1.0.0',
  };
}

export function givenSomeDeviceWlanProps(): DeviceWlanProps {
  return {
    ipv4: '127.0.0.1',
    ssid: 'ssid',
    port: 80,
    mask: '255.255.255.0',
    mac: '00:00:00:00:00:00',
  };
}

export function givenSomeRoomProps(): RoomProps {
  return {
    id: ID.generate(),
    name: 'room',
    isEnabled: true,
    center: new MapCoordinate(givenSomeMapCoordinateProps()),
    pixels: [new MapPixel(givenSomeMapPixelProps())],
  };
}

export function givenSomeZoneProps(): ZoneProps {
  return {
    id: ID.generate(),
    coordinates: [new MapCoordinate(givenSomeMapCoordinateProps())],
  };
}

export function givenSomeDeviceMapProps(): DeviceMapProps {
  return {
    id: ID.generate(),
    size: new MapPixel(givenSomeMapPixelProps()),
    min: new MapCoordinate(givenSomeMapCoordinateProps()),
    max: new MapCoordinate(givenSomeMapCoordinateProps()),
    resolution: 0.1,
    grid: Buffer.from('000', 'hex'),
    rooms: [new Room(givenSomeRoomProps())],
    restrictedZones: [new Zone(givenSomeZoneProps())],
    robotPath: [new MapCoordinate(givenSomeMapCoordinateProps())],
  };
}

export function givenSomeUserProps(): UserProps {
  return {
    id: ID.generate(),
  };
}

export function givenSomeDeviceOrderProps(): DeviceOrderProps {
  return {
    id: ID.generate(),
    mapId: ID.generate(),
    planId: ID.generate(),
    isEnabled: true,
    isRepeatable: true,
    isDeepClean: true,
    weekDays: [new WeekDay(WeekDayValue.Monday), new WeekDay(WeekDayValue.Wednesday)],
    time: new DeviceTime(givenSomeDeviceTimeProps()),
    cleanMode: new CleanMode(CleanModeValue.Auto),
    fanSpeed: new DeviceFanSpeed(DeviceFanSpeedValue.High),
    waterLevel: new DeviceWaterLevel(DeviceWaterLevelValue.High),
  };
}
