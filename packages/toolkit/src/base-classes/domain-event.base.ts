import { Validatable } from './validatable.base';
import type { ID } from '../domain-primitives/id.domain-primitive';

export interface DomainEventProps {
  aggregateId: ID;
}

export abstract class DomainEvent<T extends DomainEventProps = DomainEventProps> extends Validatable<T> {
  readonly eventName = this.constructor.name;

  constructor(protected readonly props: T) {
    super(props);
  }

  get aggregateId(): ID {
    return this.props.aggregateId;
  }
}
