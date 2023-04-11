/** Checks if the object has the given key. */
export function hasKey<O, K extends PropertyKey>(obj: O, key: K): obj is O & Record<K, unknown> {
  return Object.prototype.hasOwnProperty.call(obj, key);
}
