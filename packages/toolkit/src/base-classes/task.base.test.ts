import { expect } from 'chai';
import { Task } from './task.base';
import { Validatable } from './validatable.base';

describe('Task', function () {
  it('should be created', function () {
    const dummyTask = new DummyTask({ foo: 'bar' });

    expect(dummyTask).to.be.instanceOf(Validatable);
  });
});

interface DummyTaskInput {
  foo: string;
}

interface DummyTaskOutput {
  bar: string;
}

class DummyTask extends Task<DummyTaskInput, DummyTaskOutput> {
  protected validate(): void {
    // noop
  }
}
