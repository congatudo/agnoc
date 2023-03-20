import { EventBus } from '@agnoc/toolkit';
import type { CommandEventNames, CommandEvents } from '../commands/commands';

export type CommandEventBusEvents = { [Name in CommandEventNames]: CommandEvents[Name] };
export class CommandEventBus extends EventBus<CommandEventBusEvents> {}
