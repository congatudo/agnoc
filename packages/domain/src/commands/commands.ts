import { CleanSpotCommand } from './clean-spot.command';
import { CleanZonesCommand } from './clean-zones.command';
import { LocateDeviceCommand } from './locate-device.command';
import { PauseCleaningCommand } from './pause-cleaning.command';
import { ResetConsumableCommand } from './reset-consumable.command';
import { ReturnHomeCommand } from './return-home.command';
import { SetCarpetModeCommand } from './set-carpet-mode.command';
import { SetDeviceModeCommand } from './set-device-mode.command';
import { SetDeviceQuietHoursCommand } from './set-device-quiet-hours.command';
import { SetDeviceVoiceCommand } from './set-device-voice.command';
import { SetFanSpeedCommand } from './set-fan-speed.command';
import { SetWaterLevelCommand } from './set-water-level.command';
import { StartCleaningCommand } from './start-cleaning.command';
import { StopCleaningCommand } from './stop-cleaning.command';
import type { InstanceTypeProps } from '@agnoc/toolkit';

/** Commands that can be executed. */
export const Commands = {
  CleanSpotCommand,
  CleanZonesCommand,
  LocateDeviceCommand,
  PauseCleaningCommand,
  ResetConsumableCommand,
  ReturnHomeCommand,
  SetCarpetModeCommand,
  SetDeviceModeCommand,
  SetDeviceQuietHoursCommand,
  SetDeviceVoiceCommand,
  SetFanSpeedCommand,
  SetWaterLevelCommand,
  StartCleaningCommand,
  StopCleaningCommand,
} as const;

/** Commands that can be executed. */
export type Commands = InstanceTypeProps<typeof Commands>;

/** Names of commands that can be executed. */
export type CommandNames = keyof typeof Commands;
