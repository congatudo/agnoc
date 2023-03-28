import type { LocateDeviceCommand } from './locate-device.command';
import type { SetDeviceQuietHoursCommand } from './set-device-quiet-hours.command';
import type { SetDeviceVoiceCommand } from './set-device-voice.command';

export type Commands = {
  LocateDeviceCommand: LocateDeviceCommand;
  SetDeviceQuietHoursCommand: SetDeviceQuietHoursCommand;
  SetDeviceVoiceCommand: SetDeviceVoiceCommand;
};

export type CommandNames = keyof Commands;
