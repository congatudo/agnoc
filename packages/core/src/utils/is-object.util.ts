import { ObjectLiteral } from '../types/object-literal.type';
import { isPresent } from './is-present.util';

export function isObject(obj: unknown): obj is ObjectLiteral {
  return isPresent(obj) && !Array.isArray(obj) && typeof obj === 'object';
}
