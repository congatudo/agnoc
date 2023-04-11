import Emittery from 'emittery';

/** Base class for event bus. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class EventBus<Events = any> extends Emittery<Events> {}
