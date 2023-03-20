import type { LocateDeviceCommand } from './locate-device.command';

export type Commands = {
  LocateDeviceCommand: LocateDeviceCommand;
};

export type CommandNames = keyof Commands;
