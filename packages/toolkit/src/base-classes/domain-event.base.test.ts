import { expect } from 'chai';
import { ID } from '../domain-primitives/id.domain-primitive';
import { DomainEvent } from './domain-event.base';
import { Validatable } from './validatable.base';
import type { DomainEventProps } from './domain-event.base';

describe('DomainEvent', function () {
  it('should be created', function () {
    const aggregateId = ID.generate();
    const dummyDomainEvent = new DummyDomainEvent({ aggregateId });

    expect(dummyDomainEvent).to.be.instanceOf(Validatable);
    expect(dummyDomainEvent.aggregateId).to.be.instanceOf(ID);
  });
});

class DummyDomainEvent extends DomainEvent {
  protected validate(_: DomainEventProps): void {
    // noop
  }
}
