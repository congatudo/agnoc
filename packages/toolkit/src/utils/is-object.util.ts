import { isPresent } from './is-present.util';
import type { ObjectLiteral } from '../types/object-literal.type';

export function isObject(obj: unknown): obj is ObjectLiteral {
  return isPresent(obj) && !Array.isArray(obj) && typeof obj === 'object';
}
