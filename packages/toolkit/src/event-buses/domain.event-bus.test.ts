import { expect } from 'chai';
import { EventBus } from '../base-classes/event-bus.base';
import { DomainEventBus } from './domain.event-bus';

describe('DomainEventBus', function () {
  let domainEventBus: DomainEventBus;

  beforeEach(function () {
    domainEventBus = new DomainEventBus();
  });

  it('should be created', function () {
    expect(domainEventBus).to.be.instanceOf(EventBus);
  });
});
