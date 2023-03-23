import { TaskBus } from '@agnoc/toolkit';
import type { Commands } from '../commands/commands';
import type { Queries } from '../queries/queries';

export type CommandsOrQueries = Commands & Queries;
export type CommandOrQueryNames = keyof CommandsOrQueries;

export class CommandQueryBus extends TaskBus<CommandsOrQueries> {}
