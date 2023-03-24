import { expect } from 'chai';
import { ID } from '../domain-primitives/id.domain-primitive';
import { Task } from './task.base';
import { Validatable } from './validatable.base';

describe('Task', function () {
  it('should be created', function () {
    const now = Date.now();
    const dummyTask = new DummyTask({ foo: 'bar' });

    expect(dummyTask).to.be.instanceOf(Validatable);
    expect(dummyTask.id).to.be.instanceOf(ID);
    expect(dummyTask.taskName).to.be.equal('DummyTask');
    expect(dummyTask.metadata.timestamp).to.be.greaterThanOrEqual(now);
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
