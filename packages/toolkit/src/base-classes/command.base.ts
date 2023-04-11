import { Task } from './task.base';

/** Base class for commands. */
export abstract class Command<Input, Output> extends Task<Input, Output> {}
