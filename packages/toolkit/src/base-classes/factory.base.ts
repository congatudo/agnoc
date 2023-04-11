/** Base class for factories. */
export abstract class Factory<T> {
  abstract create(...args: unknown[]): T;
}
