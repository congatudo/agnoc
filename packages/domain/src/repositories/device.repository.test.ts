import { Repository } from '@agnoc/toolkit';
import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceRepository } from './device.repository';
import type { Adapter, DomainEventBus } from '@agnoc/toolkit';

describe('DeviceRepository', function () {
  let domainEventBus: DomainEventBus;
  let adapter: Adapter;
  let repository: DeviceRepository;

  beforeEach(function () {
    domainEventBus = imock();
    adapter = imock();
    repository = new DeviceRepository(instance(domainEventBus), instance(adapter));
  });

  it('should be a repository', function () {
    expect(repository).to.be.an.instanceOf(Repository);
  });
});
