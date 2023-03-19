import { Validatable } from './validatable.base';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CommandProps {}

export abstract class Command<T extends CommandProps = CommandProps> extends Validatable<T> {
  constructor(protected readonly props: T) {
    super(props);
  }
}
