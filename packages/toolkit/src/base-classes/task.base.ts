import { ID } from '../domain-primitives/id.domain-primitive';
import { Validatable } from './validatable.base';

/** Input props for tasks. */
export type TaskInput<T> = T extends Task<infer Input, unknown> ? Input : never;

/** Output props for tasks. */
export type TaskOutput<T> = T extends Task<unknown, infer Output> ? Output : never;

/** Metadata for tasks. */
export interface TaskMetadata {
  /** Timestamp of the task. */
  timestamp: number;
}

/** Base class for tasks. */
export abstract class Task<Input, Output> extends Validatable<Input> implements Task<Input, Output> {
  readonly id = ID.generate();
  readonly taskName = this.constructor.name;
  readonly metadata: TaskMetadata;

  constructor(protected readonly props: Input) {
    super(props);
    this.metadata = {
      timestamp: Date.now(),
    };
  }

  validateOutput?(output: Output): void;
}
