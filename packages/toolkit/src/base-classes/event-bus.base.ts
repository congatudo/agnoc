import Emittery from 'emittery';

export type EventBusEvents = { [key: string]: unknown };

export abstract class EventBus<Events = EventBusEvents> extends Emittery<Events> {}
