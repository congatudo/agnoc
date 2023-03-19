import type { CommandEventNames, CommandEvents } from '../commands/commands';
import type { EventHandler } from '@agnoc/toolkit';

export abstract class CommandEventHandler implements EventHandler {
  abstract eventName: CommandEventNames;
  abstract handle(event: CommandEvents[this['eventName']]): void;
}
