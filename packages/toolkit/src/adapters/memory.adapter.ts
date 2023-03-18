import { Adapter } from '../base-classes/adapter.base';
import type { ID } from '../domain-primitives/id.domain-primitive';

export class MemoryAdapter extends Adapter {
  private readonly data = new Map();

  get(id: ID): unknown {
    return this.data.get(id.value);
  }

  set(id: ID, value: unknown): void {
    this.data.set(id.value, value);
  }

  delete(id: ID): void {
    this.data.delete(id.value);
  }

  getAll(): unknown[] {
    return Array.from(this.data.values());
  }
}
