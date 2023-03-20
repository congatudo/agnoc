import type { CommandNames, Commands } from '../commands/commands';
import type { TaskHandler } from '@agnoc/toolkit';

export abstract class CommandHandler implements TaskHandler {
  abstract forName: CommandNames;
  abstract handle(event: Commands[this['forName']]): void;
}
