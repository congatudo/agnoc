import { anything, capture, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { EventHandlerManager } from './event-handler.manager';
import type { EventBus, EventHandler } from '@agnoc/toolkit';

describe('EventHandlerManager', function () {
  let eventBus: EventBus;
  let eventHandler: EventHandler;
  let eventHandlerManager: EventHandlerManager;

  beforeEach(function () {
    eventBus = imock();
    eventHandler = imock();
    eventHandlerManager = new EventHandlerManager(instance(eventBus));
  });

  it('should listen for events on the bus', function () {
    when(eventHandler.eventName).thenReturn('event');

    eventHandlerManager.register(instance(eventHandler));

    verify(eventBus.on('event', anything())).once();
  });

  it('should call handle when event is emitted', async function () {
    const data = { foo: 'bar' };

    when(eventHandler.eventName).thenReturn('event');

    eventHandlerManager.register(instance(eventHandler));

    const [eventName, callback] = capture(eventBus.on<'event'>).first();

    expect(eventName).to.equal('event');

    await callback(data);

    verify(eventHandler.handle(data)).once();
  });
});
