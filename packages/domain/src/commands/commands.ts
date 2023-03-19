import type { LocateDeviceCommand } from './locate-device.command';

export type CommandEvents = {
  LocateDeviceCommand: LocateDeviceCommand;
};

export type CommandEventNames = keyof CommandEvents;
