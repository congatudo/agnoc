import { setTimeout } from 'timers/promises';
import { fnmock, instance, nextTick, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { TimeoutException } from '../exceptions/timeout.exception';
import { WaiterService } from './waiter.service';
import type { WaitForCallback } from './waiter.service';

describe('WaiterService', function () {
  let service: WaiterService;

  beforeEach(function () {
    service = new WaiterService();
  });

  it('resolves when condition is met with default options', async function () {
    const callback: WaitForCallback = fnmock();
    const promise = service.waitFor(instance(callback));

    when(callback()).thenReturn(false).thenReturn(true);

    await nextTick();

    verify(callback()).once();

    await setTimeout(30);

    verify(callback()).once();

    await setTimeout(30);

    verify(callback()).twice();

    return promise;
  });

  it('resolves when condition is met with custom interval', async function () {
    const callback: WaitForCallback = fnmock();
    const promise = service.waitFor(instance(callback), { interval: 30 });

    when(callback()).thenReturn(false).thenReturn(true);

    await nextTick();

    verify(callback()).once();

    await setTimeout(40);

    verify(callback()).twice();

    return promise;
  });

  it('rejects when condition is not met and timeout triggers', async function () {
    const callback: WaitForCallback = fnmock();
    const promise = service.waitFor(instance(callback), { timeout: 100 });

    when(callback()).thenReturn(false);

    await setTimeout(110);

    verify(callback()).twice();

    await expect(promise).to.be.rejectedWith(TimeoutException, 'Timeout waiting for condition');
  });
});
