import { expect } from 'chai';
import { EventBus } from './event-bus.base';

describe('EventBus', function () {
  const eventName = 'event';
  let dummyEventBus: DummyEventBus;

  beforeEach(function () {
    dummyEventBus = new DummyEventBus();
  });

  it('should listen for events on the bus', function () {
    dummyEventBus.on(eventName, (data) => {
      expect(data).to.deep.equal({ foo: 'bar' });
    });

    return dummyEventBus.emit(eventName, { foo: 'bar' });
  });

  it('should throw an error when a listener for an event throws an error', function () {
    dummyEventBus.on(eventName, () => {
      // noop
    });

    dummyEventBus.on(eventName, () => {
      throw new Error('event error');
    });

    return expect(dummyEventBus.emit(eventName, { foo: 'bar' })).to.be.rejectedWith(Error, 'event error');
  });

  it('should reject with an error when a listener for an event rejects with an error', function () {
    const eventName = 'event';

    dummyEventBus.on(eventName, () => {
      // noop
    });

    dummyEventBus.on(eventName, () => {
      return Promise.reject(new Error('event error'));
    });

    return expect(dummyEventBus.emit(eventName, { foo: 'bar' })).to.be.rejectedWith(Error, 'event error');
  });
});

class DummyEventBus extends EventBus {}
