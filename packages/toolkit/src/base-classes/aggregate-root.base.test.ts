import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { ID } from '../domain-primitives/id.domain-primitive';
import { AggregateRoot } from './aggregate-root.base';
import { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';
import type { DomainEventProps } from './domain-event.base';
import type { EntityProps } from './entity.base';
import type { EventBus } from './event-bus.base';

describe('AggregateRoot', function () {
  let eventBus: EventBus;

  beforeEach(function () {
    eventBus = imock();
  });

  it('should be created', function () {
    const dummyAggregateRoot = new DummyAggregateRoot({ id: ID.generate() });

    expect(dummyAggregateRoot).to.be.instanceOf(Entity);
  });

  it('should be able to add domain events', function () {
    const dummyAggregateRoot = new DummyAggregateRoot({ id: ID.generate() });

    dummyAggregateRoot.doSomething();

    expect(dummyAggregateRoot.domainEvents).to.be.lengthOf(1);
    expect(dummyAggregateRoot.domainEvents[0]).to.be.instanceOf(DummyDomainEvent);
  });

  it('should be able to publish domain events', async function () {
    const id = ID.generate();
    const dummyAggregateRoot = new DummyAggregateRoot({ id });

    when(eventBus.emit(anything(), anything())).thenResolve();

    dummyAggregateRoot.doSomething();

    await dummyAggregateRoot.publishEvents(instance(eventBus));

    expect(dummyAggregateRoot.domainEvents).to.be.lengthOf(0);

    verify(eventBus.emit('DummyDomainEvent', deepEqual(new DummyDomainEvent({ aggregateId: id })))).once();
  });

  it('should be able to clear domain events', function () {
    const dummyAggregateRoot = new DummyAggregateRoot({ id: ID.generate() });

    dummyAggregateRoot.doSomething();
    dummyAggregateRoot.clearEvents();

    expect(dummyAggregateRoot.domainEvents).to.be.lengthOf(0);
  });
});

class DummyDomainEvent extends DomainEvent {
  protected validate(_: DomainEventProps): void {
    // noop
  }
}

class DummyAggregateRoot extends AggregateRoot<EntityProps> {
  doSomething(): void {
    this.addEvent(new DummyDomainEvent({ aggregateId: this.id }));
  }

  protected validate(_: EntityProps): void {
    // noop
  }
}
