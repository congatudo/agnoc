import { isPresent } from "./is-present.util";

export function isObject(obj: unknown): obj is Record<string, unknown> {
  return isPresent(obj) && !Array.isArray(obj) && typeof obj === "object";
}
