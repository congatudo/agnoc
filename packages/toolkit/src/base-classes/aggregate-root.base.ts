import { TypedEmitter } from 'tiny-typed-emitter';
import { Entity } from './entity.base';
import type { BaseEntityProps } from './entity.base';
import type { ListenerSignature } from 'tiny-typed-emitter';

export class AggregateRoot<EntityProps extends BaseEntityProps, EntityEvents extends ListenerSignature<EntityEvents>>
  extends Entity<EntityProps>
  implements TypedEmitter<EntityEvents>
{
  eventEmitter = new TypedEmitter<EntityEvents>();

  addListener<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.addListener(event, listener);

    return this;
  }

  prependListener<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.prependListener(event, listener);

    return this;
  }

  prependOnceListener<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.prependOnceListener(event, listener);

    return this;
  }

  removeListener<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.removeListener(event, listener);

    return this;
  }

  removeAllListeners(event?: keyof EntityEvents): this {
    this.eventEmitter.removeAllListeners(event);

    return this;
  }

  once<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.once(event, listener);

    return this;
  }

  on<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.on(event, listener);

    return this;
  }

  off<U extends keyof EntityEvents>(event: U, listener: EntityEvents[U]): this {
    this.eventEmitter.off(event, listener);

    return this;
  }

  emit<U extends keyof EntityEvents>(event: U, ...args: Parameters<EntityEvents[U]>): boolean {
    return this.eventEmitter.emit(event, ...args);
  }

  eventNames<U extends keyof EntityEvents>(): U[] {
    return this.eventEmitter.eventNames();
  }

  listenerCount(type: keyof EntityEvents): number {
    return this.eventEmitter.listenerCount(type);
  }

  listeners<U extends keyof EntityEvents>(type: U): EntityEvents[U][] {
    return this.eventEmitter.listeners(type);
  }

  rawListeners<U extends keyof EntityEvents>(type: U): EntityEvents[U][] {
    return this.eventEmitter.rawListeners(type);
  }

  getMaxListeners(): number {
    return this.eventEmitter.getMaxListeners();
  }

  setMaxListeners(n: number): this {
    this.eventEmitter.setMaxListeners(n);

    return this;
  }
}
