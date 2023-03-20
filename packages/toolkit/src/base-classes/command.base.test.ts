import { expect } from 'chai';
import { Command } from './command.base';
import { Task } from './task.base';

describe('Command', function () {
  it('should be created', function () {
    const dummyCommand = new DummyCommand({ foo: 'bar' });

    expect(dummyCommand).to.be.instanceOf(Task);
  });
});

interface DummyCommandInput {
  foo: string;
}

interface DummyCommandOutput {
  bar: string;
}

class DummyCommand extends Command<DummyCommandInput, DummyCommandOutput> {
  protected validate(): void {
    // noop
  }
}
