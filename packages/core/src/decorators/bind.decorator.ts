/* eslint-disable @typescript-eslint/ban-types */
export function bind<T extends Function>(
  _: unknown,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
): TypedPropertyDescriptor<T> {
  if (!descriptor || typeof descriptor.value !== "function") {
    throw new TypeError(
      `Only methods can be decorated with @bind. <${propertyKey}> is not a method!`
    );
  }

  return {
    configurable: true,
    get(this: T): T {
      const bound = (descriptor.value as Function).bind(this) as T;

      Object.defineProperty(this, propertyKey, {
        value: bound,
        configurable: true,
        writable: true,
      });

      return bound;
    },
  };
}
