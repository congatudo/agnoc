import { Repository } from '@agnoc/toolkit';
import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceRepository } from './device.repository';
import type { Adapter, EventBus } from '@agnoc/toolkit';

describe('DeviceRepository', function () {
  let eventBus: EventBus;
  let adapter: Adapter;
  let repository: DeviceRepository;

  beforeEach(function () {
    eventBus = imock();
    adapter = imock();
    repository = new DeviceRepository(instance(eventBus), instance(adapter));
  });

  it('should be a repository', function () {
    expect(repository).to.be.an.instanceOf(Repository);
  });
});
