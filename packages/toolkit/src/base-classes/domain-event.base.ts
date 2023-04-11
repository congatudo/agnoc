import { ID } from '../domain-primitives/id.domain-primitive';
import { Validatable } from './validatable.base';

/** Properties for domain events. */
export interface DomainEventProps {
  /** ID of the aggregate the event belongs to. */
  aggregateId: ID;
}

/** Metadata for domain events. */
export interface DomainEventMetadata {
  /** Timestamp of the event. */
  timestamp: number;
}

/** Base class for domain events. */
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
