/* eslint-disable security/detect-object-injection */
import { isObject } from "./is-object.util";

function convertToRaw(item: unknown): unknown {
  if (isObject(item) && typeof item.toJSON === "function") {
    return item.toJSON();
  }
  return item;
}

export function convertPropsToObject(
  props: Record<string, unknown>
): Record<string, unknown> {
  const propsCopy = { ...props };

  for (const prop in propsCopy) {
    if (Array.isArray(propsCopy[prop])) {
      propsCopy[prop] = (propsCopy[prop] as Array<unknown>).map((item) => {
        return convertToRaw(item);
      });
    }
    propsCopy[prop] = convertToRaw(propsCopy[prop]);
  }

  return propsCopy;
}
