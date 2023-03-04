export abstract class Factory<T> {
  abstract create(...args: unknown[]): T;
}
