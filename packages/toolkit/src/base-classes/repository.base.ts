/* eslint-disable @typescript-eslint/require-await */
import type { Adapter } from './adapter.base';
import type { AggregateRoot } from './aggregate-root.base';
import type { EntityProps } from './entity.base';
import type { EventBus } from './event-bus.base';
import type { ID } from '../domain-primitives/id.domain-primitive';

export abstract class Repository<T extends AggregateRoot<EntityProps>> {
  constructor(private readonly eventBus: EventBus, protected readonly adapter: Adapter) {}

  async findOneById(id: ID): Promise<T | undefined> {
    return this.adapter.get(id) as T | undefined;
  }

  async findAll(): Promise<T[]> {
    return this.adapter.getAll() as T[];
  }

  async saveOne(entity: T): Promise<void> {
    this.adapter.set(entity.id, entity);
    await entity.publishEvents(this.eventBus);
  }

  async deleteOne(entity: T): Promise<void> {
    this.adapter.delete(entity.id);
    await entity.publishEvents(this.eventBus);
  }
}
