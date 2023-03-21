import { TaskBus } from '@agnoc/toolkit';
import { expect } from 'chai';
import { CommandBus } from './command.event-bus';

describe('CommandBus', function () {
  let commandBus: CommandBus;

  beforeEach(function () {
    commandBus = new CommandBus();
  });

  it('should be created', function () {
    expect(commandBus).to.be.instanceOf(TaskBus);
  });
});
