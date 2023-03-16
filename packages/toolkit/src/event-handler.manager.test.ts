import { imock, instance, verify } from '@johanblumenberg/ts-mockito';
import { EventHandlerManager } from './event-handler.manager';
import type { EventHandler } from './base-classes/event-handler.base';

describe('EventHandlerManager', function () {
  let eventHandler: EventHandler;

  beforeEach(function () {
    eventHandler = imock();
  });

  it('should listen up event handlers', function () {
    new EventHandlerManager([instance(eventHandler), instance(eventHandler)]);

    verify(eventHandler.listen()).twice();
  });
});
