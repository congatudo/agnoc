/** Base class for event handlers. */
export abstract class EventHandler {
  // eslint-disable-next-line @typescript-eslint/ban-types
  abstract eventName: string;
  abstract handle(...args: unknown[]): void;
}
