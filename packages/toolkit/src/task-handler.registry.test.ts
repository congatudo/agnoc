import { anything, capture, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { TaskHandlerRegistry } from './task-handler.registry';
import type { TaskBus } from './base-classes/task-bus.base';
import type { TaskHandler } from './base-classes/task-handler.base';
import type { Task } from './base-classes/task.base';

describe('TaskHandlerRegistry', function () {
  let task: Task<void, void>;
  let taskBus: TaskBus;
  let taskHandler: TaskHandler;
  let taskHandlerManager: TaskHandlerRegistry;

  beforeEach(function () {
    task = imock();
    taskBus = imock();
    taskHandler = imock();
    taskHandlerManager = new TaskHandlerRegistry(instance(taskBus));
  });

  it('should listen for tasks on the bus', function () {
    when(taskHandler.forName).thenReturn('task');

    taskHandlerManager.register(instance(taskHandler));

    verify(taskBus.subscribe('task', anything())).once();
  });

  it('should call handle when task is emitted', async function () {
    when(taskHandler.forName).thenReturn('task');

    taskHandlerManager.register(instance(taskHandler));

    const [forName, callback] = capture(taskBus.subscribe<'task'>).first();

    expect(forName).to.equal('task');

    await callback(instance(task));

    verify(taskHandler.handle(instance(task))).once();
  });
});
