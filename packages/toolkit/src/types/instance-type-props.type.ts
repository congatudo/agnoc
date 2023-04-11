import type { Constructor } from './constructor.type';

/**
 * Returns the instance type of each property of a given type.
 *
 * @example
 * ```typescript
 * class A {}
 * class B {}
 *
 * const Map = {
 *   A,
 *   B,
 * };
 *
 * type Map = InstanceTypeProps<typeof Map>; // Map { A: A; B: B; }
 * ```
 */
export type InstanceTypeProps<T extends Record<keyof T, Constructor>> = {
  [K in keyof T]: InstanceType<T[K]>;
};
