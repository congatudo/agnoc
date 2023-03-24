import { ID } from '../domain-primitives/id.domain-primitive';
import { Validatable } from './validatable.base';

export interface DomainEventProps {
  aggregateId: ID;
}

export interface DomainEventMetadata {
  timestamp: number;
}

export abstract class DomainEvent<T extends DomainEventProps = DomainEventProps> extends Validatable<T> {
  readonly id = ID.generate();
  readonly eventName = this.constructor.name;
  readonly metadata: DomainEventMetadata;

  constructor(protected readonly props: T) {
    super(props);
    this.metadata = {
      timestamp: Date.now(),
    };
  }

  get aggregateId(): ID {
    return this.props.aggregateId;
  }
}
