export abstract class Command {
  abstract action(...args: unknown[]): void | Promise<void>;
}
