import { setTimeout } from 'timers/promises';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { TimeoutException } from '../exceptions/timeout.exception';
import { waitFor } from './wait-for.util';

describe('wait-for.util', () => {
  it('resolves when condition is met', async () => {
    let check = false,
      called = false;
    const promise = waitFor(() => check);

    void promise.then(() => {
      called = true;
    });

    expect(called).to.be.false;

    check = true;

    await setTimeout(50);

    expect(called).to.be.true;
  });

  it('rejects when condition is not met and timeout triggers', async () => {
    let called = false;
    const check = false;
    const promise = waitFor(() => check, { timeout: 100 });

    void promise.catch((e) => {
      expect(e).to.be.instanceof(TimeoutException);
      called = true;
    });

    await setTimeout(50);

    expect(called).to.be.false;

    await setTimeout(50);

    expect(called).to.be.true;
  });
});
