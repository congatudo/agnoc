import { expect } from 'chai';
import { DomainException } from '../exceptions/domain.exception';
import { TaskBus } from './task-bus.base';
import { Task } from './task.base';

describe('TaskBus', function () {
  let dummyTaskBus: DummyTaskBus;

  beforeEach(function () {
    dummyTaskBus = new DummyTaskBus();
  });

  it('should subscribe and trigger tasks', async function () {
    dummyTaskBus.subscribe('IOTask', (task) => {
      expect(task).to.be.instanceOf(IOTask);

      return { bar: 'bar' };
    });
    dummyTaskBus.subscribe('ITask', (task) => {
      expect(task).to.be.instanceOf(ITask);
    });

    const ioTaskOutput = await dummyTaskBus.trigger(new IOTask({ foo: 'foo' }));

    expect(ioTaskOutput).to.be.deep.equal({ bar: 'bar' });

    const iTaskOutput = await dummyTaskBus.trigger(new ITask({ wow: 'wow' }));

    expect(iTaskOutput).to.be.undefined;
  });

  it('should subscribe async tasks', async function () {
    dummyTaskBus.subscribe('IOTask', async () => {
      return { bar: 'bar' };
    });

    const ioTaskOutput = await dummyTaskBus.trigger(new IOTask({ foo: 'foo' }));

    expect(ioTaskOutput).to.be.deep.equal({ bar: 'bar' });
  });

  it('should throw an error when no handlers are registered', async function () {
    await expect(dummyTaskBus.trigger(new IOTask({ foo: 'foo' }))).to.be.rejectedWith(
      DomainException,
      'No handlers registered for IOTask',
    );
  });

  it('should throw an error when no handlers are fulfilled', async function () {
    dummyTaskBus.subscribe('IOTask', () => {
      throw new Error('foo');
    });

    await expect(dummyTaskBus.trigger(new IOTask({ foo: 'foo' }))).to.be.rejectedWith(
      DomainException,
      'No handlers fulfilled for IOTask',
    );
  });

  it('should throw an error when more than one handler is fulfilled', async function () {
    dummyTaskBus.subscribe('IOTask', () => {
      return { bar: 'bar' };
    });
    dummyTaskBus.subscribe('IOTask', () => {
      return { bar: 'bar' };
    });

    await expect(dummyTaskBus.trigger(new IOTask({ foo: 'foo' }))).to.be.rejectedWith(
      DomainException,
      'Multiple handlers fulfilled for IOTask',
    );
  });
});

interface IOTaskInput {
  foo: string;
}

interface IOTaskOutput {
  bar: string;
}

class IOTask extends Task<IOTaskInput, IOTaskOutput> {
  protected validate() {
    // noop
  }
}

interface ITaskInput {
  wow: string;
}

class ITask extends Task<ITaskInput, void> {
  protected validate() {
    // noop
  }
}

type DummyTaskBusTasks = {
  IOTask: IOTask;
  ITask: ITask;
};

class DummyTaskBus extends TaskBus<DummyTaskBusTasks> {}
