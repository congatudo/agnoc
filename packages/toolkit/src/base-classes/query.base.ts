import { Task } from './task.base';

export abstract class Query<Input, Output> extends Task<Input, Output> {}
