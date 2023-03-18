/** Base class for event handlers. */
export abstract class EventHandler {
  abstract eventName: string;
  abstract handle(...args: unknown[]): void;
}
