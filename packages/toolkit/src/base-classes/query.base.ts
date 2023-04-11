import { Task } from './task.base';

/** Base class for all queries. */
export abstract class Query<Input, Output> extends Task<Input, Output> {}
