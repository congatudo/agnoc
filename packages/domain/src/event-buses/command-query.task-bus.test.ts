import { TaskBus } from '@agnoc/toolkit';
import { expect } from 'chai';
import { CommandQueryBus } from './command-query.task-bus';

describe('CommandBus', function () {
  let commandBus: CommandQueryBus;

  beforeEach(function () {
    commandBus = new CommandQueryBus();
  });

  it('should be created', function () {
    expect(commandBus).to.be.instanceOf(TaskBus);
  });
});
