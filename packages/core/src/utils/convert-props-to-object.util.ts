import { ObjectLiteral } from '../types/object-literal.type';
import { isObject } from './is-object.util';

function convertToRaw(item: unknown): unknown {
  if (isObject(item) && typeof item.toJSON === 'function') {
    return item.toJSON();
  }
  return item;
}

export function convertPropsToObject(props: unknown): ObjectLiteral {
  if (!isObject(props)) {
    throw new TypeError(`Unable to convert props type <${typeof props}> to object`);
  }

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
