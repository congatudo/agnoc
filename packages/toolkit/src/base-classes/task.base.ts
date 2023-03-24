import { ID } from '../domain-primitives/id.domain-primitive';
import { Validatable } from './validatable.base';

export type TaskInput<T> = T extends Task<infer Input, unknown> ? Input : never;
export type TaskOutput<T> = T extends Task<unknown, infer Output> ? Output : never;

export interface TaskMetadata {
  timestamp: number;
}

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
