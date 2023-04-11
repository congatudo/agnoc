import type { EventHandler } from './base-classes/event-handler.base';
import type { TaskBus, TaskBusSubscribeHandler, TaskBusTasks } from './base-classes/task-bus.base';
import type { TaskHandler } from './base-classes/task-handler.base';

/** Manages event handlers. */
export class TaskHandlerRegistry<T extends TaskBusTasks = TaskBusTasks> {
  constructor(private readonly taskBus: TaskBus<T>) {}

  register(...taskHandlers: TaskHandler[]): void {
    taskHandlers.forEach((taskHandler) => this.addEventHandler(taskHandler));
  }

  private addEventHandler(eventHandler: EventHandler): void {
    this.taskBus.subscribe(
      eventHandler.forName,
      eventHandler.handle.bind(eventHandler) as TaskBusSubscribeHandler<T, keyof T>,
    );
  }
}
