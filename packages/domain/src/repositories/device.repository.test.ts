import { Repository } from '@agnoc/toolkit';
import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceRepository } from './device.repository';
import type { Adapter } from '@agnoc/toolkit';

describe('DeviceRepository', function () {
  let adapter: Adapter;
  let repository: DeviceRepository;

  beforeEach(function () {
    adapter = imock();
    repository = new DeviceRepository(instance(adapter));
  });

  it('should be a repository', function () {
    expect(repository).to.be.an.instanceOf(Repository);
  });
});
