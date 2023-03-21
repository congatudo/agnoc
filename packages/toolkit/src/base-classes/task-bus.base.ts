import { DomainException } from '../exceptions/domain.exception';
import { debug } from '../utils/debug.util';
import { toDashCase } from '../utils/to-dash-case.util';
import type { Task, TaskOutput } from './task.base';

export type TaskBusSubscribeHandler<Events extends TaskBusTasks, Name extends keyof Events> = (
  task: Events[Name],
) => TaskOutput<Events[Name]> | Promise<TaskOutput<Events[Name]>>;

export type TaskBusTasks = {
  [key: string]: Task<unknown, unknown>;
};

export abstract class TaskBus<Tasks extends TaskBusTasks = TaskBusTasks> {
  private readonly debug = debug(__filename).extend(toDashCase(this.constructor.name));
  private readonly handlers = new Map<keyof Tasks, Set<TaskBusSubscribeHandler<Tasks, keyof Tasks>>>();

  subscribe<Name extends keyof Tasks>(name: Name, handler: TaskBusSubscribeHandler<Tasks, Name>): void {
    this.debug(`subscribing to task '${name.toString()}'`);

    if (!this.handlers.has(name)) {
      this.handlers.set(name, new Set());
    }

    this.handlers.get(name)?.add(handler as TaskBusSubscribeHandler<Tasks, keyof Tasks>);
  }

  async trigger<Task extends Tasks[keyof Tasks]>(task: Task): Promise<TaskOutput<Task>> {
    const name = task.constructor.name as keyof Tasks & string;

    this.debug(`triggering task '${name}'`);

    const handlers = this.handlers.get(name as keyof Tasks);

    if (!handlers) {
      throw new DomainException(`No handlers registered for ${name}`);
    }

    const promises = [...handlers].map(async (handler) => handler(task));
    const outputs = await Promise.allSettled(promises);
    const fulfilledOutputs = this.filterFulfilledPromises(outputs);

    if (fulfilledOutputs.length === 0) {
      throw new DomainException(`No handlers fulfilled for ${name}`);
    }

    if (fulfilledOutputs.length > 1) {
      throw new DomainException(`Multiple handlers fulfilled for ${name}`);
    }

    const output = fulfilledOutputs[0].value;

    task.validateOutput?.(output);

    this.debug(`task '${name}' completed successfully with output: ${JSON.stringify(output)}`);

    return output;
  }

  private filterFulfilledPromises<Task extends Tasks[keyof Tasks]>(
    outputs: PromiseSettledResult<TaskOutput<Tasks[keyof Tasks]>>[],
  ) {
    return outputs.filter((output) => output.status === 'fulfilled') as PromiseFulfilledResult<TaskOutput<Task>>[];
  }
}
