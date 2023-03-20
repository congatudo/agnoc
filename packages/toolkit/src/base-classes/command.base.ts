import { Task } from './task.base';

export abstract class Command<Input, Output> extends Task<Input, Output> {}
