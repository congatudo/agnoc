import { Validatable } from './validatable.base';

export type TaskInput<T> = T extends Task<infer Input, unknown> ? Input : never;
export type TaskOutput<T> = T extends Task<unknown, infer Output> ? Output : never;

export abstract class Task<Input, Output> extends Validatable<Input> implements Task<Input, Output> {
  constructor(protected readonly props: Input) {
    super(props);
  }

  validateOutput?(output: Output): void;
}
