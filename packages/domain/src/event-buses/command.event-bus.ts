import { TaskBus } from '@agnoc/toolkit';
import type { Commands } from '../commands/commands';

export class CommandBus extends TaskBus<Commands> {}
