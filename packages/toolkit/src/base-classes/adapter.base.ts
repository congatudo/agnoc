import type { ID } from '../domain-primitives/id.domain-primitive';

export abstract class Adapter {
  abstract getAll(): unknown[];
  abstract get(id: ID): unknown;
  abstract set(id: ID, value: unknown): void;
  abstract delete(id: ID): void;
}
