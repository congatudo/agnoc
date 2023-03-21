export function toDashCase(str: string): string {
  return str
    .replace(/[_. ]/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase();
}
