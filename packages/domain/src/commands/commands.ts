import type { CleanSpotCommand } from './clean-spot.command';
import type { CleanZonesCommand } from './clean-zones.command';
import type { LocateDeviceCommand } from './locate-device.command';
import type { PauseCleaningCommand } from './pause-cleaning.command';
import type { ResetConsumableCommand } from './reset-consumable.command';
import type { ReturnHomeCommand } from './return-home.command';
import type { SetCarpetModeCommand } from './set-carpet-mode.command';
import type { SetDeviceModeCommand } from './set-device-mode.command';
import type { SetDeviceQuietHoursCommand } from './set-device-quiet-hours.command';
import type { SetDeviceVoiceCommand } from './set-device-voice.command';
import type { SetFanSpeedCommand } from './set-fan-speed.command';
import type { SetWaterLevelCommand } from './set-water-level.command';
import type { StartCleaningCommand } from './start-cleaning.command';
import type { StopCleaningCommand } from './stop-cleaning.command';

/** Commands that can be executed. */
export type Commands = {
  CleanSpotCommand: CleanSpotCommand;
  CleanZonesCommand: CleanZonesCommand;
  LocateDeviceCommand: LocateDeviceCommand;
  PauseCleaningCommand: PauseCleaningCommand;
  ResetConsumableCommand: ResetConsumableCommand;
  ReturnHomeCommand: ReturnHomeCommand;
  SetCarpetModeCommand: SetCarpetModeCommand;
  SetDeviceModeCommand: SetDeviceModeCommand;
  SetDeviceQuietHoursCommand: SetDeviceQuietHoursCommand;
  SetDeviceVoiceCommand: SetDeviceVoiceCommand;
  SetFanSpeedCommand: SetFanSpeedCommand;
  SetWaterLevelCommand: SetWaterLevelCommand;
  StartCleaningCommand: StartCleaningCommand;
  StopCleaningCommand: StopCleaningCommand;
};

/** Names of commands that can be executed. */
export type CommandNames = keyof Commands;
