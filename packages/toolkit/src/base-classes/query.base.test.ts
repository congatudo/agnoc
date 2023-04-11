import { expect } from 'chai';
import { Query } from './query.base';
import { Task } from './task.base';

describe('Query', function () {
  it('should be created', function () {
    const dummyQuery = new DummyQuery({ foo: 'bar' });

    expect(dummyQuery).to.be.instanceOf(Task);
  });
});

interface DummyQueryInput {
  foo: string;
}

interface DummyQueryOutput {
  bar: string;
}

class DummyQuery extends Query<DummyQueryInput, DummyQueryOutput> {
  protected validate(): void {
    // noop
  }
}
