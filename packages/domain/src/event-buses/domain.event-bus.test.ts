import { EventBus } from '@agnoc/toolkit';
import { expect } from 'chai';
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
