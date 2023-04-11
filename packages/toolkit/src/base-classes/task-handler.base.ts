/** Base class for event handlers. */
export abstract class TaskHandler {
  // eslint-disable-next-line @typescript-eslint/ban-types
  abstract forName: string;
  abstract handle(...args: unknown[]): void;
}
