import Emittery from 'emittery';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class EventBus<Events = any> extends Emittery<Events> {}
